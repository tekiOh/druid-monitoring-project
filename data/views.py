from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
import json
import urllib.request
import urllib.parse
import datetime
import time
from . import list_queries

#쿼리를 수행하여 데이터를 받아오고 그것을 반환
def get_data_from_druid(query):
    print("get data from druic function in!!!")
    jsonQuery = query.encode('ascii')
    headers = {'Content-Type': 'application/json'}
    url = urllib.request.Request(url='http://50.1.100.143:8082/druid/v2/?pretty', data=jsonQuery, headers=headers)
    response = urllib.request.urlopen(url)
    json_response = json.loads(response.read().decode("utf-8"))

    return json_response

#'/'를 '_'로 바꾸고
def make_json(dict,data):
    for j in data:
        service_host = j['event']['service'].replace('/', '_') + ':' + j['event']['host']
        metric_name = j['event']['metric'].replace('/', '_')
        if service_host not in dict:
            dict[service_host] = {}
        if metric_name not in dict[service_host]:
            dict[service_host][metric_name] = []
        dict[service_host][metric_name].append({'timestamp': j['timestamp'], 'avg': j['event']['AVG(value)']})
    return dict

def get_kpi_json(kpi_json,data):
    for k ,v in data.items():
        if k not in kpi_json:
            kpi_json[k] = {}
        for ik,iv in v.items():
            if ik+'_kpi' not in kpi_json[k]:
                kpi_json[k][ik + '_kpi'] = {}
                if len(iv) == 2:
                    kpi_json[k][ik + '_kpi']['diff_value'] = round((iv[1]['avg'] - iv[0]['avg']),3)
                    kpi_json[k][ik + '_kpi']['diff_percent'] = round(((iv[1]['avg'] - iv[0]['avg'])/(iv[0]['avg']+0.000000001))*100,2)
                else:
                    kpi_json[k][ik + '_kpi']['diff_value'] = 0
                    kpi_json[k][ik + '_kpi']['diff_percent'] = 0

    return kpi_json

def get_final_json(data):
    print("final data"*10)
    # print(data)
    final_metrics_list = {}
    for k, v in data.items():
        # print(k)
        if k not in final_metrics_list:
            final_metrics_list[k] = {}
        for ik, iv in v.items():
            metric_name = ik.split('_kpi')[0]
            # print(ik)
            # print(metric_name)
            if metric_name not in final_metrics_list[k]:
                final_metrics_list[k][metric_name] = {}
                final_metrics_list[k][metric_name]['timestamp'] = []
                final_metrics_list[k][metric_name]['avg'] = []
                final_metrics_list[k][metric_name]['percent'] = []
                final_metrics_list[k][metric_name]['kpi'] = {}
            if '_kpi' in ik:
                print(ik)
                for iik, iiv in iv.items():
                    if iik not in final_metrics_list[k][metric_name]['kpi']:
                        #print(iik)
                        final_metrics_list[k][metric_name]['kpi'][iik] = iiv
            else:
                for iiv in iv:
                    final_metrics_list[k][metric_name]['timestamp'].append(iiv['timestamp'])
                    final_metrics_list[k][metric_name]['avg'].append(iiv['avg'])
                    if 'percent' in iiv:
                        final_metrics_list[k][metric_name]['percent'].append(iiv['percent'])

                # if ik.split('_')[-1] == 'kpi':
                #     final_metrics_list[k][ik] = {}
                #     for iik, iiv in iv.items():
                #         if iik not in final_metrics_list[k][ik]:
                #             final_metrics_list[k][ik][iik] = iiv
                # else:
                #     final_metrics_list[k][ik] = {}
                #     final_metrics_list[k][ik]['timestamp'] = []
                #     final_metrics_list[k][ik]['avg'] = []
                #     final_metrics_list[k][ik]['percent'] = []
                #     for iiv in iv:
                #         final_metrics_list[k][ik]['timestamp'].append(iiv['timestamp'])
                #         final_metrics_list[k][ik]['avg'].append(iiv['avg'])
                #         if 'percent' in iiv:
                #             final_metrics_list[k][ik]['percent'].append(iiv['percent'])
    return final_metrics_list

def get_jvm_overview_kpi(query_format):
    query_format[0] = "hour"
    query = list_queries.query_jvm_overview % (tuple(query_format))
    json_response = get_data_from_druid(query)
    metric_list = make_json({}, json_response)
    for v in metric_list.values():
        for metric in ['jvm_bufferpool_capacity', 'jvm_gc_mem_max', 'jvm_mem_max', 'jvm_pool_max']:
            v.pop(metric, None)

    # print(json.dumps(metric_list, indent=4, sort_keys=True))

    dictresponse = get_kpi_json({},metric_list)

    # print(json.dumps(dictresponse, indent=4, sort_keys=True))

    return dictresponse

def get_jvm_overview(nodename):
    print("jvm overview function in!!")
    granularity = "minute"
    nowtime = datetime.datetime.now()
    servertime = nowtime - datetime.timedelta(hours=9)
    stime = servertime - datetime.timedelta(minutes=60)
    interval_e = servertime.isoformat()
    interval_s = stime.isoformat()
    query_format = [granularity,interval_s, interval_e,nodename]

    query = list_queries.query_jvm_overview % (tuple(query_format))
    json_response = get_data_from_druid(query)

    metric_list = make_json({},json_response)
    start_time = time.clock()
    for v in metric_list.values():
        key_list = list(v.keys())
        for i in range(0, len(key_list)):
            for j in range(i + 1, len(key_list)):
                if key_list[i].split('_')[:-1] == key_list[j].split('_')[:-1]:
                    for f, s in zip(v[key_list[i]], v[key_list[j]]):
                        s['percent'] = round((s['avg'] / f['avg']) * 100, 1)
                    break

    for v in metric_list.values():
        for metric in ['jvm_bufferpool_capacity', 'jvm_gc_mem_max', 'jvm_mem_max', 'jvm_pool_max']:
            v.pop(metric, None)

    kpiresponse = get_jvm_overview_kpi(query_format)
    for k in kpiresponse.keys():
        if k in metric_list:
            for ik,iv in kpiresponse[k].items():
                if ik not in metric_list[k]:
                    metric_list[k][ik] = iv


    # print("jvm overview kpi print")
    # print(json.dumps(metric_list, indent=4, sort_keys=True))
    # for k,v in metric_list.items():
    #     print(k)
    #     for ik,iv in metric_list[k].items():
    #         print(ik)


    return metric_list

def get_node_overview_kpi(query_format):
    query_format[0] = "hour"
    print(query_format)
    if "broker" in query_format[3]:
        query = list_queries.query_broker_overview % (tuple(query_format))
    if "historical" in query_format[3]:
        query = list_queries.query_historical_overview % (tuple(query_format))
    if "coordinator" in query_format[3]:
        query = list_queries.query_coordinator_overview % (tuple(query_format))
    if "overlord" in query_format[3]:
        query = list_queries.query_overlord_overview % (tuple(query_format))
    if "middleManager" in query_format[3]:
        query = list_queries.query_middleManager_overview % (tuple(query_format))

    json_response = get_data_from_druid(query)
    metric_list = make_json({}, json_response)
    dictresponse = get_kpi_json({}, metric_list)

    return dictresponse

def get_broker_overview(request):
    granuality = "minute"
    nowtime = datetime.datetime.now()
    servertime = nowtime - datetime.timedelta(hours=9)
    stime = servertime - datetime.timedelta(minutes=60)
    interval_e = servertime.isoformat()
    interval_s = stime.isoformat()
    nodetype = "druid/dev/broker"
    query_format = [granuality,interval_s, interval_e,nodetype]

    start_time = time.clock()

    query = list_queries.query_broker_overview % (tuple(query_format))
    json_response = get_data_from_druid(query)

    metric_list = get_jvm_overview("druid/dev/broker")
    metric_list = make_json(metric_list, json_response)

    broker_kpi = get_node_overview_kpi(query_format)

    for k in metric_list.keys():
        if k in broker_kpi:
            for ik,iv in broker_kpi[k].items():
                if ik not in metric_list[k]:
                    metric_list[k][ik] = iv

    # print("metric_list" * 10)
    # print(json.dumps(metric_list, indent=4, sort_keys=True))

    final_metrics_list = get_final_json(metric_list)

    print(json.dumps(final_metrics_list, indent=4, sort_keys=True))
    t = time.clock() - start_time
    print("broker overview takes...")
    print(t, "seconds")
    return HttpResponse(json.dumps(final_metrics_list, indent=4, sort_keys=True))


def get_historical_overview(request):
    granuality = "minute"
    nowtime = datetime.datetime.now()
    servertime = nowtime - datetime.timedelta(hours=9)
    stime = servertime - datetime.timedelta(minutes=60)
    interval_e = servertime.isoformat()
    interval_s = stime.isoformat()
    nodetype =  "druid/dev/historical"
    query_format = [granuality,interval_s, interval_e,nodetype]

    start_time = time.clock()

    query = list_queries.query_historical_overview % (tuple(query_format))
    json_response = get_data_from_druid(query)

    metric_list = get_jvm_overview("druid/dev/historical")
    metric_list = make_json(metric_list, json_response)

    t = time.clock() - start_time
    print("historical overview takes...")
    print(t, "seconds")

    # for j in metric_list.keys():
    #     print(j)
    #     for ik,iv in metric_list[j].items():
    #         print(ik,iv)
    #         print(len(iv))

    historical_kpi = get_node_overview_kpi(query_format)
    for k in metric_list.keys():
        if k in historical_kpi:
            for ik,iv in historical_kpi[k].items():
                if ik not in metric_list[k]:
                    metric_list[k][ik] = iv

    final_metrics_list = get_final_json(metric_list)

    print(json.dumps(final_metrics_list, indent=4, sort_keys=True))
    t = time.clock() - start_time
    print("historical overview takes...")
    print(t, "seconds")
    return HttpResponse(json.dumps(final_metrics_list, indent=4, sort_keys=True))

def get_coordinator_overview(request):
    granuality = "minute"
    nowtime = datetime.datetime.now()
    servertime = nowtime - datetime.timedelta(hours=9)
    stime = servertime - datetime.timedelta(minutes=60)
    interval_e = servertime.isoformat()
    interval_s = stime.isoformat()
    nodetype = "druid/dev/coordinator"
    query_format = [granuality,interval_s, interval_e, nodetype]

    start_time = time.clock()

    query = list_queries.query_coordinator_overview % (tuple(query_format))
    json_response = get_data_from_druid(query)

    metric_list = get_jvm_overview("druid/dev/coordinator")
    metric_list = make_json(metric_list, json_response)

    for j in metric_list.keys():
        print(j)
        for ik,iv in metric_list[j].items():
            print(ik,iv)
            print(len(iv))

    coordinator_kpi = get_node_overview_kpi(query_format)
    for k in metric_list.keys():
        if k in coordinator_kpi:
            for ik,iv in coordinator_kpi[k].items():
                if ik not in metric_list[k]:
                    metric_list[k][ik] = iv

    final_metrics_list = get_final_json(metric_list)
    t = time.clock() - start_time
    print("coordinator overview takes...")
    print(t, "seconds")
    print(json.dumps(final_metrics_list, indent=4, sort_keys=True))

    return HttpResponse(json.dumps(final_metrics_list, indent=4, sort_keys=True))


def get_overlord_overview(request):
    granuality = "minute"
    nowtime = datetime.datetime.now()
    servertime = nowtime - datetime.timedelta(hours=9)
    stime = servertime - datetime.timedelta(minutes=60)
    interval_e = servertime.isoformat()
    interval_s = stime.isoformat()
    nodetype = "druid/dev/overlord"
    query_format = [granuality,interval_s, interval_e,nodetype]

    start_time = time.clock()

    query = list_queries.query_overlord_overview % (tuple(query_format))
    json_response = get_data_from_druid(query)

    metric_list = get_jvm_overview("druid/dev/overlord")
    metric_list = make_json(metric_list, json_response)

    for j in metric_list.keys():
        print(j)
        for ik,iv in metric_list[j].items():
            print(ik,iv)
            print(len(iv))

    overlord_kpi = get_node_overview_kpi(query_format)
    for k in metric_list.keys():
        if k in overlord_kpi:
            for ik,iv in overlord_kpi[k].items():
                if ik not in metric_list[k]:
                    metric_list[k][ik] = iv

    final_metrics_list = get_final_json(metric_list)
    t = time.clock() - start_time

    print(json.dumps(final_metrics_list, indent=4, sort_keys=True))
    print("overlord overview takes...")
    print(t, "seconds")

    return HttpResponse(json.dumps(final_metrics_list, indent=4, sort_keys=True))

def get_middleManager_overview(request):
    granuality = "minute"
    nowtime = datetime.datetime.now()
    servertime = nowtime - datetime.timedelta(hours=9)
    stime = servertime - datetime.timedelta(minutes=60)
    interval_e = servertime.isoformat()
    interval_s = stime.isoformat()
    nodetype = "druid/dev/middleManager"
    query_format = [granuality,interval_s, interval_e,nodetype]

    start_time = time.clock()
    print("middleManager query make!!")
    query = list_queries.query_middleManager_overview % (tuple(query_format))
    json_response = get_data_from_druid(query)

    metric_list = get_jvm_overview("druid/dev/middleManager")
    metric_list = make_json(metric_list, json_response)

    broker_kpi = get_node_overview_kpi(query_format)

    for k in metric_list.keys():
        if k in broker_kpi:
            for ik,iv in broker_kpi[k].items():
                if ik not in metric_list[k]:
                    metric_list[k][ik] = iv

    final_metrics_list = get_final_json(metric_list)

    print(json.dumps(final_metrics_list, indent=4, sort_keys=True))
    t = time.clock() - start_time
    print("middleManager overview takes...")
    print(t, "seconds")

    return HttpResponse(json.dumps(final_metrics_list, indent=4, sort_keys=True))


def get_node_list(request):
    nowtime = datetime.datetime.now()
    servertime = nowtime - datetime.timedelta(hours=9)
    stime = servertime - datetime.timedelta(minutes=1)
    interval_e = servertime.isoformat()
    interval_s = stime.isoformat()
    query_format = [interval_s, interval_e]

    query = list_queries.query_get_node_list % (tuple(query_format))
    json_response = get_data_from_druid(query)

    node_list = {}
    for j in json_response:
        ip = j["event"]["host"].split(':')[0]
        port = j["event"]["host"].split(':')[-1]
        if ip not in node_list:
            node_list[ip] = {}
        if j["event"]["service"] not in node_list[ip]:
            node_list[ip][j["event"]["service"]] = []
        if port not in node_list[ip][j["event"]["service"]]:
            node_list[ip][j["event"]["service"]].append(port)

    print(node_list)

    return HttpResponse(json.dumps(node_list))


def get_metriclist(request):
    granuality = "minute"
    nowtime = datetime.datetime.now()
    servertime = nowtime - datetime.timedelta(hours=9)
    stime = servertime - datetime.timedelta(minutes=60)
    interval_e = servertime.isoformat()
    interval_s = stime.isoformat()
    nodetype = "druid/dev/broker"
    query_format = [granuality, interval_s, interval_e, nodetype]

    start_time = time.clock()

    query = list_queries.query_broker_overview % (tuple(query_format))
    json_response = get_data_from_druid(query)

    metric_list = {}
    for j in json_response:
        service_host = j['event']['service'].replace('/','_')+':'+j['event']['host']
        metric_name = j['event']['metric'].replace('/', '_')
        if service_host not in metric_list:
            metric_list[service_host] = {}
        if metric_name not in metric_list[service_host]:
            metric_list[service_host][metric_name] = []
            metric_list[service_host][metric_name].append({'timestamp' : j['timestamp'],'avg' : j['event']['AVG(value)']})
    t = time.clock() - start_time
    print("broker overview takes...")
    print(t, "seconds")

    return HttpResponse(json.dumps(metric_list))

