broker_overview_query = '''
{
      "queryType": "groupBy",
      "dataSource": {
        "type": "table",
        "name": "druid_kafka_emitter_01"
      },
      "granularity": "hour",
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
              "druid/dev/broker"
            ]
          },
          {
            "type": "in",
            "dimension": "metric",
            "values": [
              "query/cache/delta/hitRate","query/time"
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

query_jvm_overview = '''
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
            "dimension": "metric",
            "values": [
              "jvm/bufferpool/capacity","jvm/bufferpool/used","jvm/gc/mem/max",
              "jvm/gc/mem/used","jvm/mem/max","jvm/mem/used","jvm/pool/max",
              "jvm/pool/used"
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

query_broker_overview = '''
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
            "dimension": "metric",
            "values": [
              "query/cache/delta/hitRate","query/time"
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

query_historical_overview = '''
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
            "dimension": "metric",
            "values": [
              "query/cache/delta/hitRate","query/time"
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

query_coordinator_overview = '''
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
            "dimension": "metric",
            "values": [

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

query_overlord_overview = '''
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
            "dimension": "metric",
            "values": [
                "task/run/time"
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

query_middleManager_overview = '''
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
            "dimension": "metric",
            "values": [
                "ingest/events/processed",
                "ingest/events/thrownAway",
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