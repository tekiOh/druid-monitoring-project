query_broker_detailview = '''
{
      "queryType": "groupBy",
      "dataSource": {
        "type": "table",
        "name": "druid_kafka_emitter_01"
      },
      "granularity": "%s",
      "intervals": [
        "%s/%s"
      ],
      "dimensions": [
        {
          "type": "default",
          "dimension": "host",
          "outputName": "host"
        },
        {
          "type": "default",
          "dimension": "service",
          "outputName": "service"
        },
        {
          "type": "default",
          "dimension": "metric",
          "outputName": "metric"
        }
      ],
      "filter": {
        "type": "and",
        "fields": [
          {
            "type": "in",
            "dimension": "service",
            "values": [
              "%s"
            ]
          },
          {
            "type": "in",
            "dimension": "host",
            "values": [
              "%s"
            ]
          },
          {
            "type": "in",
            "dimension": "metric",
            "values": [
              "jvm/bufferpool/capacity","jvm/bufferpool/used","jvm/gc/mem/max",
              "jvm/gc/mem/used","jvm/mem/max","jvm/mem/used","jvm/pool/max",
              "jvm/pool/used","query/cache/delta/hitRate","query/time","query/cache/delta/hits",
              "query/cache/delta/misses"
            ]
          }
        ]
      },
      "aggregations": [
        {
          "type": "sum",
          "name": "value_sum",
          "fieldName": "value",
          "inputType": "double"
        },
        {
          "type": "sum",
          "name": "count_sum",
          "fieldName": "count",
          "inputType": "double"
        }
      ],
      "postAggregations": [
        {
          "type": "arithmetic",
          "name": "AVG(value)",
          "fn": "/",
          "fields": [
            {
              "type": "fieldAccess",
              "name": "value_sum",
              "fieldName": "value_sum"
            },
            {
              "type": "fieldAccess",
              "name": "count_sum",
              "fieldName": "count_sum"
            }
          ]
        }
      ],
      "limitSpec": {
        "type": "default",
        "limit": 100000
      }
    }
'''

query_historical_detailview = '''
{
      "queryType": "groupBy",
      "dataSource": {
        "type": "table",
        "name": "druid_kafka_emitter_01"
      },
      "granularity": "%s",
      "intervals": [
        "%s/%s"
      ],
      "dimensions": [
        {
          "type": "default",
          "dimension": "host",
          "outputName": "host"
        },
        {
          "type": "default",
          "dimension": "service",
          "outputName": "service"
        },
        {
          "type": "default",
          "dimension": "metric",
          "outputName": "metric"
        }
      ],
      "filter": {
        "type": "and",
        "fields": [
          {
            "type": "in",
            "dimension": "service",
            "values": [
              "%s"
            ]
          },
          {
            "type": "in",
            "dimension": "host",
            "values": [
              "%s"
            ]
          },
          {
            "type": "in",
            "dimension": "metric",
            "values": [
              "jvm/bufferpool/capacity","jvm/bufferpool/used","jvm/gc/mem/max",
              "jvm/gc/mem/used","jvm/mem/max","jvm/mem/used","jvm/pool/max",
              "jvm/pool/used","query/cache/delta/errors","query/cache/delta/evictions",
              "query/cache/delta/hitRate","query/cache/delta/hits",
              "query/cache/delta/misses","query/cache/delta/timeouts"
            ]
          }
        ]
      },
      "aggregations": [
        {
          "type": "sum",
          "name": "value_sum",
          "fieldName": "value",
          "inputType": "double"
        },
        {
          "type": "sum",
          "name": "count_sum",
          "fieldName": "count",
          "inputType": "double"
        }
      ],
      "postAggregations": [
        {
          "type": "arithmetic",
          "name": "AVG(value)",
          "fn": "/",
          "fields": [
            {
              "type": "fieldAccess",
              "name": "value_sum",
              "fieldName": "value_sum"
            },
            {
              "type": "fieldAccess",
              "name": "count_sum",
              "fieldName": "count_sum"
            }
          ]
        }
      ],
      "limitSpec": {
        "type": "default",
        "limit": 100000
      }
    }
'''

query_coordinator_detailview = '''
{
      "queryType": "groupBy",
      "dataSource": {
        "type": "table",
        "name": "druid_kafka_emitter_01"
      },
      "granularity": "%s",
      "intervals": [
        "%s/%s"
      ],
      "dimensions": [
        {
          "type": "default",
          "dimension": "host",
          "outputName": "host"
        },
        {
          "type": "default",
          "dimension": "service",
          "outputName": "service"
        },
        {
          "type": "default",
          "dimension": "metric",
          "outputName": "metric"
        }
      ],
      "filter": {
        "type": "and",
        "fields": [
          {
            "type": "in",
            "dimension": "service",
            "values": [
              "%s"
            ]
          },
          {
            "type": "in",
            "dimension": "host",
            "values": [
              "%s"
            ]
          },
          {
            "type": "in",
            "dimension": "metric",
            "values": [
              "jvm/bufferpool/capacity","jvm/bufferpool/used","jvm/gc/mem/max",
              "jvm/gc/mem/used","jvm/mem/max","jvm/mem/used","jvm/pool/max",
              "jvm/pool/used","segment/moved/count","segment/dropped/count",
              "segment/deleted/count","segment/unneeded/count"        
            ]
          }
        ]
      },
      "aggregations": [
        {
          "type": "sum",
          "name": "value_sum",
          "fieldName": "value",
          "inputType": "double"
        },
        {
          "type": "sum",
          "name": "count_sum",
          "fieldName": "count",
          "inputType": "double"
        }
      ],
      "postAggregations": [
        {
          "type": "arithmetic",
          "name": "AVG(value)",
          "fn": "/",
          "fields": [
            {
              "type": "fieldAccess",
              "name": "value_sum",
              "fieldName": "value_sum"
            },
            {
              "type": "fieldAccess",
              "name": "count_sum",
              "fieldName": "count_sum"
            }
          ]
        }
      ],
      "limitSpec": {
        "type": "default",
        "limit": 100000
      }
    }
'''

query_overlord_detailview = '''
{
      "queryType": "groupBy",
      "dataSource": {
        "type": "table",
        "name": "druid_kafka_emitter_01"
      },
      "granularity": "%s",
      "intervals": [
        "%s/%s"
      ],
      "dimensions": [
        {
          "type": "default",
          "dimension": "host",
          "outputName": "host"
        },
        {
          "type": "default",
          "dimension": "service",
          "outputName": "service"
        },
        {
          "type": "default",
          "dimension": "metric",
          "outputName": "metric"
        }
      ],
      "filter": {
        "type": "and",
        "fields": [
          {
            "type": "in",
            "dimension": "service",
            "values": [
              "%s"
            ]
          },
          {
            "type": "in",
            "dimension": "host",
            "values": [
              "%s"
            ]
          },
          {
            "type": "in",
            "dimension": "metric",
            "values": [
              "jvm/bufferpool/capacity","jvm/bufferpool/used","jvm/gc/mem/max",
              "jvm/gc/mem/used","jvm/mem/max","jvm/mem/used","jvm/pool/max",
              "jvm/pool/used","task/run/time"
            ]
          }
        ]
      },
      "aggregations": [
        {
          "type": "sum",
          "name": "value_sum",
          "fieldName": "value",
          "inputType": "double"
        },
        {
          "type": "sum",
          "name": "count_sum",
          "fieldName": "count",
          "inputType": "double"
        }
      ],
      "postAggregations": [
        {
          "type": "arithmetic",
          "name": "AVG(value)",
          "fn": "/",
          "fields": [
            {
              "type": "fieldAccess",
              "name": "value_sum",
              "fieldName": "value_sum"
            },
            {
              "type": "fieldAccess",
              "name": "count_sum",
              "fieldName": "count_sum"
            }
          ]
        }
      ],
      "limitSpec": {
        "type": "default",
        "limit": 100000
      }
    }
'''

query_middleManager_detailview = '''
{
      "queryType": "groupBy",
      "dataSource": {
        "type": "table",
        "name": "druid_kafka_emitter_01"
      },
      "granularity": "%s",
      "intervals": [
        "%s/%s"
      ],
      "dimensions": [
        {
          "type": "default",
          "dimension": "host",
          "outputName": "host"
        },
        {
          "type": "default",
          "dimension": "service",
          "outputName": "service"
        },
        {
          "type": "default",
          "dimension": "metric",
          "outputName": "metric"
        }
      ],
      "filter": {
        "type": "and",
        "fields": [
          {
            "type": "in",
            "dimension": "service",
            "values": [
              "%s"
            ]
          },
          {
            "type": "in",
            "dimension": "host",
            "values": [
              "%s"
            ]
          },
          {
            "type": "in",
            "dimension": "metric",
            "values": [
              "jvm/bufferpool/capacity","jvm/bufferpool/used","jvm/gc/mem/max",
              "jvm/gc/mem/used","jvm/mem/max","jvm/mem/used","jvm/pool/max",
              "jvm/pool/used","ingest/events/processed","ingest/events/thrownAway",
              "ingest/events/unparseable"
            ]
          }
        ]
      },
      "aggregations": [
        {
          "type": "sum",
          "name": "value_sum",
          "fieldName": "value",
          "inputType": "double"
        },
        {
          "type": "sum",
          "name": "count_sum",
          "fieldName": "count",
          "inputType": "double"
        }
      ],
      "postAggregations": [
        {
          "type": "arithmetic",
          "name": "AVG(value)",
          "fn": "/",
          "fields": [
            {
              "type": "fieldAccess",
              "name": "value_sum",
              "fieldName": "value_sum"
            },
            {
              "type": "fieldAccess",
              "name": "count_sum",
              "fieldName": "count_sum"
            }
          ]
        }
      ],
      "limitSpec": {
        "type": "default",
        "limit": 100000
      }
    }
'''

query_get_node_list = '''
{
      "queryType": "groupBy",
      "dataSource": {
        "type": "table",
        "name": "druid_kafka_emitter_01"
      },
      "granularity": "year",
      "intervals": [
        "%s/%s"
      ],
      "dimensions": [
        {
          "type": "default",
          "dimension": "host",
          "outputName": "host"
        },
        {
          "type": "default",
          "dimension": "service",
          "outputName": "service"
        },
        {
          "type": "default",
          "dimension": "metric",
          "outputName": "metric"
        }
      ],
      "filter": {
        "type": "and",
        "fields": [
          {
            "type": "in",
            "dimension": "metric",
            "values": [
                "jvm/gc/mem/used"
            ]
          }
        ]
      },
      "aggregations": [
        {
          "type": "sum",
          "name": "value_sum",
          "fieldName": "value",
          "inputType": "double"
        },
        {
          "type": "sum",
          "name": "count_sum",
          "fieldName": "count",
          "inputType": "double"
        }
      ],
      "postAggregations": [
        {
          "type": "arithmetic",
          "name": "AVG(value)",
          "fn": "/",
          "fields": [
            {
              "type": "fieldAccess",
              "name": "value_sum",
              "fieldName": "value_sum"
            },
            {
              "type": "fieldAccess",
              "name": "count_sum",
              "fieldName": "count_sum"
            }
          ]
        }
      ],
      "limitSpec": {
        "type": "default",
        "limit": 100000
      }
    }
'''