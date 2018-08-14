import json
import urllib.request
import urllib.parse


# 쿼리를 수행하여 데이터를 받아오고 그것을 반환
def get_data_from_druid(query):
    print("get data from druic function in!!!")
    jsonQuery = query.encode('ascii')
    headers = {'Content-Type': 'application/json'}
    url = urllib.request.Request(url='http://50.1.100.143:8082/druid/v2/?pretty', data=jsonQuery, headers=headers)
    response = urllib.request.urlopen(url)
    json_response = json.loads(response.read().decode("utf-8"))

    return json_response


# '/'를 '_'로 바꾸고
def make_json(dict, data):
    for j in data:
        service_host = j['event']['service'] + ':' + j['event']['host']
        metric_name = j['event']['metric']
        if service_host not in dict:
            dict[service_host] = {}
        if metric_name not in dict[service_host]:
            dict[service_host][metric_name] = []
        dict[service_host][metric_name].append({'timestamp': j['timestamp'], 'avg': j['event']['AVG(value)']})
    return dict


def get_kpi_json(kpi_json, data):
    for k, v in data.items():
        if k not in kpi_json:
            kpi_json[k] = {}
        for ik, iv in v.items():
            if ik + '/kpi' not in kpi_json[k]:
                kpi_json[k][ik + '/kpi'] = {}
                if len(iv) == 2:
                    if 'percent' in iv[0]:
                        kpi_json[k][ik + '/kpi']['current'] = iv[1]['percent']
                        kpi_json[k][ik + '/kpi']['past'] = iv[0]['percent']
                    else:
                        kpi_json[k][ik + '/kpi']['current'] = iv[1]['avg']
                        kpi_json[k][ik + '/kpi']['past'] = iv[0]['avg']
                    if 'jvm' in ik:
                        kpi_json[k][ik + '/kpi']['diff_value'] = round((iv[1]['avg'] - iv[0]['avg']) / (1024 * 1024), 2)
                    elif 'time' in ik:
                        kpi_json[k][ik + '/kpi']['diff_value'] = round((iv[1]['avg'] - iv[0]['avg']) / (1000), 2)
                    else:
                        kpi_json[k][ik + '/kpi']['diff_value'] = round((iv[1]['avg'] - iv[0]['avg']), 2)
                    kpi_json[k][ik + '/kpi']['diff_percent'] = round(
                        ((iv[1]['avg'] - iv[0]['avg']) / (iv[0]['avg'] + 0.000000001)) * 100, 2)
                else:
                    if 'percent' in iv[0]:
                        kpi_json[k][ik + '/kpi']['current'] = 0
                        kpi_json[k][ik + '/kpi']['past'] = 0
                    kpi_json[k][ik + '/kpi']['diff_value'] = 0
                    kpi_json[k][ik + '/kpi']['diff_percent'] = 0

    return kpi_json


def get_final_json(data):
    final_metrics_list = {}
    for k, v in data.items():
        # print(k)
        if k not in final_metrics_list:
            final_metrics_list[k] = {}
        for ik, iv in v.items():
            metric_name = ik.split('/kpi')[0]
            if metric_name not in final_metrics_list[k]:
                final_metrics_list[k][metric_name] = {}
                final_metrics_list[k][metric_name]['timestamp'] = []
                final_metrics_list[k][metric_name]['avg'] = []
                final_metrics_list[k][metric_name]['percent'] = []
                final_metrics_list[k][metric_name]['kpi'] = {}
            if '/kpi' in ik:
                print(ik)
                for iik, iiv in iv.items():
                    if iik not in final_metrics_list[k][metric_name]['kpi']:
                        # print(iik)
                        final_metrics_list[k][metric_name]['kpi'][iik] = iiv
            else:
                v_max = -999999999999999999999
                v_min = 9999999999999999999999
                for iiv in iv:
                    final_metrics_list[k][metric_name]['timestamp'].append(iiv['timestamp'])

                    if 'jvm' in ik:
                        value = round((iiv['avg']) / (1024 * 1024), 2)
                    elif 'time' in ik:
                        value = round((iiv['avg']) / (1000), 2)
                    else:
                        value = iiv['avg']

                    final_metrics_list[k][metric_name]['avg'].append(value)

                    if 'percent' in iiv:
                        final_metrics_list[k][metric_name]['percent'].append(iiv['percent'])
                        if iiv['percent'] > v_max:
                            v_max = iiv['percent']
                        if iiv['percent'] < v_min:
                            v_min = iiv['percent']
                    else:
                        if value > v_max:
                            v_max = value
                        if value < v_min:
                            v_min = value

                final_metrics_list[k][metric_name]['max'] = v_max
                final_metrics_list[k][metric_name]['min'] = v_min

    return final_metrics_list

def add_element_to_dict(dict,ik,iv):

    v_max = -999999999999999999999
    v_min = 9999999999999999999999
    for iiv in iv:
        dict['timestamp'].append(iiv['timestamp'])

        if 'jvm' in ik:
            value = round((iiv['avg']) / (1024 * 1024), 2)
        elif 'time' in ik:
            value = round((iiv['avg']) / (1000), 2)
        else:
            value = iiv['avg']

        dict['avg'].append(value)

        if 'percent' in iiv:
            dict['percent'].append(iiv['percent'])
            if iiv['percent'] > v_max:
                v_max = iiv['percent']
            if iiv['percent'] < v_min:
                v_min = iiv['percent']
        else:
            if value > v_max:
                v_max = value
            if value < v_min:
                v_min = value

    dict['max'] = v_max
    dict['min'] = v_min

    return


def get_detail_final_json(data):
    final_metrics_list = {}
    for k, v in data.items():
        # print(k)
        if k not in final_metrics_list:
            final_metrics_list[k] = {}
        for ik, iv in v.items():
            metric_name = ik.split('/kpi')[0]
            # metric_type = 0
            if 'jvm' in metric_name:
                if 'jvm' not in final_metrics_list[k]:
                    final_metrics_list[k]['jvm'] = {}
                final_metrics_list[k]['jvm'][metric_name] = {}
                final_metrics_list[k]['jvm'][metric_name]['timestamp'] = []
                final_metrics_list[k]['jvm'][metric_name]['avg'] = []
                final_metrics_list[k]['jvm'][metric_name]['percent'] = []

                add_element_to_dict(final_metrics_list[k]['jvm'][metric_name],ik,iv)

            else:
                if metric_name not in final_metrics_list[k]:
                    final_metrics_list[k][metric_name] = {}
                    final_metrics_list[k][metric_name]['timestamp'] = []
                    final_metrics_list[k][metric_name]['avg'] = []
                    final_metrics_list[k][metric_name]['percent'] = []

                add_element_to_dict(final_metrics_list[k][metric_name], ik, iv)

    return final_metrics_list


def add_percent(metric_list):
    for v in metric_list.values():
        key_list = list(v.keys())
        for i in range(0, len(key_list)):
            for j in range(i + 1, len(key_list)):
                if key_list[i].split('/')[:-1] == key_list[j].split('/')[:-1] and key_list[i].split('/')[0] == 'jvm':
                    for f, s in zip(v[key_list[i]], v[key_list[j]]):
                        s['percent'] = round((s['avg'] / (f['avg'] + 0.0000000000001)) * 100, 1)
                    break

    for v in metric_list.values():
        for metric in ['jvm/bufferpool/capacity', 'jvm/gc/mem/max', 'jvm/mem/max', 'jvm/pool/max']:
            v.pop(metric, None)

    return


def postdata(query):
    headers = {'Content-Type': 'application/json'}
    url = urllib.request.Request(url='http://localhost:8000/home/detail/post', data=(str(query).encode('utf-8')),
                                 headers=headers)
    response = urllib.request.urlopen(url)
    print("request success!!!")
    json_response = json.loads(response.read().decode("utf-8"))
    return json_response
