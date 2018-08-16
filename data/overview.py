from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
import json
import datetime
import time
from . import overview_queries
from . import data_handle


# 쿼리 리스트를 반환
def get_query_format(_granularity, _nodetype):
    nowtime = datetime.datetime.now()
    servertime = nowtime - datetime.timedelta(hours=9)
    stime = servertime - datetime.timedelta(minutes=60)
    interval_e = servertime.isoformat()
    interval_s = stime.isoformat()
    return [_granularity, interval_s, interval_e, _nodetype]


# jvm overview kpi를 반환
def get_jvm_overview_kpi(query_format):
    query_format[0] = "hour"
    query = overview_queries.query_jvm_overview % (tuple(query_format))
    json_response = data_handle.get_data_from_druid(query)
    metric_list = data_handle.make_json({}, json_response)

    data_handle.add_percent(metric_list)

    dictresponse = data_handle.get_kpi_json({}, metric_list)
    return dictresponse


# jvm overview를 반환
def get_jvm_overview(nodename):
    print("jvm overview function in!!")
    query_format = get_query_format('minute', nodename)

    query = overview_queries.query_jvm_overview % (tuple(query_format))
    json_response = data_handle.get_data_from_druid(query)
    #print(json.dumps(json_response, indent=4, sort_keys=True))
    metric_list = data_handle.make_json({}, json_response)
    start_time = time.clock()

    data_handle.add_percent(metric_list)

    kpiresponse = get_jvm_overview_kpi(query_format)
    for k in kpiresponse.keys():
        if k in metric_list:
            for ik, iv in kpiresponse[k].items():
                if ik not in metric_list[k]:
                    metric_list[k][ik] = iv

    return metric_list


# node overview kpi 반환
def get_node_overview_kpi(query_format):
    query_format[0] = "hour"
    print(query_format)
    if "broker" in query_format[3]:
        query = overview_queries.query_broker_overview % (tuple(query_format))
    elif "historical" in query_format[3]:
        query = overview_queries.query_historical_overview % (tuple(query_format))
    elif "coordinator" in query_format[3]:
        query = overview_queries.query_coordinator_overview % (tuple(query_format))
    elif "overlord" in query_format[3]:
        query = overview_queries.query_overlord_overview % (tuple(query_format))
    else:
        query = overview_queries.query_middleManager_overview % (tuple(query_format))

    json_response = data_handle.get_data_from_druid(query)
    metric_list = data_handle.make_json({}, json_response)

    dictresponse = data_handle.get_kpi_json({}, metric_list)

    return dictresponse


# node overview : jvm,kpi....를 반환
def get_node_overview(nodetype):
    query_format = get_query_format('minute', nodetype)

    start_time = time.clock()
    if 'broker' in nodetype:
        query = overview_queries.query_broker_overview % (tuple(query_format))
    elif 'historical' in nodetype:
        query = overview_queries.query_historical_overview % (tuple(query_format))
    elif 'coordinator' in nodetype:
        query = overview_queries.query_coordinator_overview % (tuple(query_format))
    elif 'middleManager' in nodetype:
        query = overview_queries.query_middleManager_overview % (tuple(query_format))
    else:
        query = overview_queries.query_overlord_overview % (tuple(query_format))

    json_response = data_handle.get_data_from_druid(query)

    metric_list = get_jvm_overview(nodetype)
    metric_list = data_handle.make_json(metric_list, json_response)

    kpi_list = get_node_overview_kpi(query_format)

    for k in metric_list.keys():
        if k in kpi_list:
            for ik, iv in kpi_list[k].items():
                if ik not in metric_list[k]:
                    metric_list[k][ik] = iv

    final_metrics_list = data_handle.get_final_json(metric_list)

    t = time.clock() - start_time
    print(nodetype, " overview takes...")
    print(t, "seconds")
    return final_metrics_list


# 각 노드의 overview 반환
def get_broker_overview(request):
    nodetype = 'druid/dev/broker'
    overview_data = get_node_overview(nodetype)
    return HttpResponse(json.dumps(overview_data, indent=4, sort_keys=True))


def get_historical_overview(request):
    nodetype = 'druid/dev/historical'
    overview_data = get_node_overview(nodetype)
    return HttpResponse(json.dumps(overview_data, indent=4, sort_keys=True))


def get_coordinator_overview(request):
    nodetype = 'druid/dev/coordinator'
    overview_data = get_node_overview(nodetype)
    return HttpResponse(json.dumps(overview_data, indent=4, sort_keys=True))


def get_overlord_overview(request):
    nodetype = 'druid/dev/overlord'
    overview_data = get_node_overview(nodetype)
    return HttpResponse(json.dumps(overview_data, indent=4, sort_keys=True))


def get_middleManager_overview(request):
    nodetype = 'druid/dev/middleManager'
    overview_data = get_node_overview(nodetype)
    return HttpResponse(json.dumps(overview_data, indent=4, sort_keys=True))


# 전체 노드 overview 반환
def get_overview_all(request):
    nodelist = ['druid/dev/broker', "druid/dev/historical", "druid/dev/coordinator", "druid/dev/middleManager",
                "druid/dev/overlord"]
    overview_data = {}
    for nodetype in nodelist:
        overview_data.update(get_node_overview(nodetype))
    return HttpResponse(json.dumps(overview_data))


# 전체 노드 리스트 반환
def get_node_list(request):
    nowtime = datetime.datetime.now()
    servertime = nowtime - datetime.timedelta(hours=9)
    stime = servertime - datetime.timedelta(days=100)
    interval_e = servertime.isoformat()
    interval_s = stime.isoformat()
    query_format = [interval_s, interval_e]

    start_time = time.clock()

    query = overview_queries.query_get_node_list % (tuple(query_format))
    json_response = data_handle.get_data_from_druid(query)

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
    t = time.clock() - start_time
    print("[get_node_list] takes...")
    print(t, "seconds")

    print(node_list)

    return HttpResponse(json.dumps(node_list))


def postjson(request):
    nowtime = datetime.datetime.now()
    servertime = nowtime - datetime.timedelta(hours=9)
    stime = servertime - datetime.timedelta(minutes=10)
    interval_e = servertime.isoformat()
    interval_s = stime.isoformat()

    query = {}
    query["start_time"] = interval_s
    query["end_time"] = interval_e
    query["node"] = 'druid/dev/broker'
    query["server"] = 'localhost'
    query["port"] = '8082'
    query["granularity"] = 'minute'
    # query["node"] = "druid/dev/historical"
    # query["start_time"] = interval_s
    # query["end_time"] = interval_e
    # query["granuality"] = "minute"
    response = data_handle.postdata(query)
    print(response)
    return HttpResponse(json.dumps(response))


def test(request):
    st = datetime.datetime(2018, 8, 6, 5, 0, 0, 0)
    et = st - datetime.timedelta(minutes=61)
    query_format = ["hour", et.isoformat(), st.isoformat(), "druid/dev/broker"]
    query = overview_queries.query_broker_overview % (tuple(query_format))
    json_response = data_handle.get_data_from_druid(query)
    print(json_response)
    return HttpResponse(json.dumps(json_response))
