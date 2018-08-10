from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
import json
import datetime
import time
from . import detailview_quries
from . import data_handle


def get_detailview_data(query):
    json_response = data_handle.get_data_from_druid(query)
    metric_list = data_handle.make_json({}, json_response)
    data_handle.add_percent(metric_list)
    final_metrics_list = data_handle.get_detail_final_json(metric_list)
    print(final_metrics_list)
    return final_metrics_list


def get_detailview_broker(query_format):
    query = detailview_quries.query_broker_detailview % (tuple(query_format))
    return get_detailview_data(query)


def get_detailview_historical(query_format):
    query = detailview_quries.query_historical_detailview % (tuple(query_format))
    return get_detailview_data(query)


def get_detailview_coordinator(query_format):
    query = detailview_quries.query_coordinator_detailview % (tuple(query_format))
    return get_detailview_data(query)


def get_detailview_overlord(query_format):
    query = detailview_quries.query_overlord_detailview % (tuple(query_format))
    return get_detailview_data(query)


def get_detailview_middleManager(query_format):
    query = detailview_quries.query_middleManager_detailview % (tuple(query_format))
    return get_detailview_data(query)


def request_handle(request):
    if request.method == "POST":
        body_unicode = request.body.decode('utf-8')
        body_unicode = body_unicode.replace("'", "\"")
        body = json.loads(body_unicode)
        print(body)
        nodetype = body['node']
        query_format = [body["granularity"], body["start_time"],
                        body["end_time"], body["node"],
                        body["server"] + ":" + body["port"]]
        print(query_format)

        if 'historical' in nodetype:
            return HttpResponse(json.dumps(get_detailview_historical(query_format), indent=4, sort_keys=True))
        elif 'broker' in nodetype:
            return HttpResponse(json.dumps(get_detailview_broker(query_format), indent=4, sort_keys=True))
        elif 'coordinator' in nodetype:
            return HttpResponse(json.dumps(get_detailview_coordinator(query_format), indent=4, sort_keys=True))
        elif 'overlord' in nodetype:
            return HttpResponse(json.dumps(get_detailview_overlord(query_format), indent=4, sort_keys=True))
        else:
            return HttpResponse(json.dumps(get_detailview_middleManager(query_format), indent=4, sort_keys=True))

        return HttpResponse(json.dumps({'success': True}))


def get_node_list(request):
    if request.method == "POST":
        body_unicode = request.body.decode('utf-8')
        body_unicode = body_unicode.replace("'", "\"")
        body = json.loads(body_unicode)
        print(body)

        query_format = [body["start"], body["end"]]

        start_time = time.clock()

        query = detailview_quries.query_get_node_list % (tuple(query_format))
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

def test(request):
    nowtime = datetime.datetime.now()
    servertime = nowtime - datetime.timedelta(hours=9)
    stime = servertime - datetime.timedelta(minutes=60)
    interval_e = servertime.isoformat()
    interval_s = stime.isoformat()
    query_format = ["minute", interval_s,
                    interval_e,'druid/dev/broker',
                    'localhost:8082']
    return HttpResponse(json.dumps(get_detailview_broker(query_format), indent=4, sort_keys=True))
