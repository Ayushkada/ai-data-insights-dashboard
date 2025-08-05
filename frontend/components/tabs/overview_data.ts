export const meta = {
    "filename": "train.csv",
    "title": "string",
    "created_at": "2025-08-05T15:11:25.979718",
    "size": 61194,
    "num_rows": 891,
    "columns": [
      "PassengerId",
      "Survived",
      "Pclass",
      "Name",
      "Sex",
      "Age",
      "SibSp",
      "Parch",
      "Ticket",
      "Fare",
      "Cabin",
      "Embarked"
    ],
    "preview": {
      "columns": [
        "PassengerId",
        "Survived",
        "Pclass",
        "Name",
        "Sex",
        "Age",
        "SibSp",
        "Parch",
        "Ticket",
        "Fare",
        "Cabin",
        "Embarked"
      ],
      "sample_rows": [
        {
          "PassengerId": 1,
          "Survived": 0,
          "Pclass": 3,
          "Name": "Braund, Mr. Owen Harris",
          "Sex": "male",
          "Age": 22,
          "SibSp": 1,
          "Parch": 0,
          "Ticket": "A/5 21171",
          "Fare": 7.25,
          "Cabin": null,
          "Embarked": "S"
        },
        {
          "PassengerId": 2,
          "Survived": 1,
          "Pclass": 1,
          "Name": "Cumings, Mrs. John Bradley (Florence Briggs Thayer)",
          "Sex": "female",
          "Age": 38,
          "SibSp": 1,
          "Parch": 0,
          "Ticket": "PC 17599",
          "Fare": 71.2833,
          "Cabin": "C85",
          "Embarked": "C"
        },
        {
          "PassengerId": 3,
          "Survived": 1,
          "Pclass": 3,
          "Name": "Heikkinen, Miss. Laina",
          "Sex": "female",
          "Age": 26,
          "SibSp": 0,
          "Parch": 0,
          "Ticket": "STON/O2. 3101282",
          "Fare": 7.925,
          "Cabin": null,
          "Embarked": "S"
        },
        {
          "PassengerId": 4,
          "Survived": 1,
          "Pclass": 1,
          "Name": "Futrelle, Mrs. Jacques Heath (Lily May Peel)",
          "Sex": "female",
          "Age": 35,
          "SibSp": 1,
          "Parch": 0,
          "Ticket": "113803",
          "Fare": 53.1,
          "Cabin": "C123",
          "Embarked": "S"
        },
        {
          "PassengerId": 5,
          "Survived": 0,
          "Pclass": 3,
          "Name": "Allen, Mr. William Henry",
          "Sex": "male",
          "Age": 35,
          "SibSp": 0,
          "Parch": 0,
          "Ticket": "373450",
          "Fare": 8.05,
          "Cabin": null,
          "Embarked": "S"
        },
        {
          "PassengerId": 6,
          "Survived": 0,
          "Pclass": 3,
          "Name": "Moran, Mr. James",
          "Sex": "male",
          "Age": null,
          "SibSp": 0,
          "Parch": 0,
          "Ticket": "330877",
          "Fare": 8.4583,
          "Cabin": null,
          "Embarked": "Q"
        },
        {
          "PassengerId": 7,
          "Survived": 0,
          "Pclass": 1,
          "Name": "McCarthy, Mr. Timothy J",
          "Sex": "male",
          "Age": 54,
          "SibSp": 0,
          "Parch": 0,
          "Ticket": "17463",
          "Fare": 51.8625,
          "Cabin": "E46",
          "Embarked": "S"
        },
        {
          "PassengerId": 8,
          "Survived": 0,
          "Pclass": 3,
          "Name": "Palsson, Master. Gosta Leonard",
          "Sex": "male",
          "Age": 2,
          "SibSp": 3,
          "Parch": 1,
          "Ticket": "349909",
          "Fare": 21.075,
          "Cabin": null,
          "Embarked": "S"
        },
        {
          "PassengerId": 9,
          "Survived": 1,
          "Pclass": 3,
          "Name": "Johnson, Mrs. Oscar W (Elisabeth Vilhelmina Berg)",
          "Sex": "female",
          "Age": 27,
          "SibSp": 0,
          "Parch": 2,
          "Ticket": "347742",
          "Fare": 11.1333,
          "Cabin": null,
          "Embarked": "S"
        },
        {
          "PassengerId": 10,
          "Survived": 1,
          "Pclass": 2,
          "Name": "Nasser, Mrs. Nicholas (Adele Achem)",
          "Sex": "female",
          "Age": 14,
          "SibSp": 1,
          "Parch": 0,
          "Ticket": "237736",
          "Fare": 30.0708,
          "Cabin": null,
          "Embarked": "C"
        }
      ]
    },
    "summary": null
  }

export const analysis = {
    "analysis": {
      "column_info": [
        {
          "name": "PassengerId",
          "dtype": "int64",
          "sample_values": [
            "1",
            "2",
            "3",
            "4",
            "5"
          ],
          "unique_count": 891,
          "is_numeric": true,
          "is_categorical": false,
          "is_datetime": false,
          "is_constant": false,
          "has_nulls": false
        },
        {
          "name": "Survived",
          "dtype": "int64",
          "sample_values": [
            "0",
            "1",
            "1",
            "1",
            "0"
          ],
          "unique_count": 2,
          "is_numeric": true,
          "is_categorical": false,
          "is_datetime": false,
          "is_constant": false,
          "has_nulls": false
        },
        {
          "name": "Pclass",
          "dtype": "int64",
          "sample_values": [
            "3",
            "1",
            "3",
            "1",
            "3"
          ],
          "unique_count": 3,
          "is_numeric": true,
          "is_categorical": false,
          "is_datetime": false,
          "is_constant": false,
          "has_nulls": false
        },
        {
          "name": "Name",
          "dtype": "object",
          "sample_values": [
            "Braund, Mr. Owen Harris",
            "Cumings, Mrs. John Bradley (Florence Briggs Thayer)",
            "Heikkinen, Miss. Laina",
            "Futrelle, Mrs. Jacques Heath (Lily May Peel)",
            "Allen, Mr. William Henry"
          ],
          "unique_count": 891,
          "is_numeric": false,
          "is_categorical": false,
          "is_datetime": false,
          "is_constant": false,
          "has_nulls": false
        },
        {
          "name": "Sex",
          "dtype": "object",
          "sample_values": [
            "male",
            "female",
            "female",
            "female",
            "male"
          ],
          "unique_count": 2,
          "is_numeric": false,
          "is_categorical": true,
          "is_datetime": false,
          "is_constant": false,
          "has_nulls": false
        },
        {
          "name": "Age",
          "dtype": "float64",
          "sample_values": [
            "22.0",
            "38.0",
            "26.0",
            "35.0",
            "35.0"
          ],
          "unique_count": 88,
          "is_numeric": true,
          "is_categorical": false,
          "is_datetime": false,
          "is_constant": false,
          "has_nulls": true
        },
        {
          "name": "SibSp",
          "dtype": "int64",
          "sample_values": [
            "1",
            "1",
            "0",
            "1",
            "0"
          ],
          "unique_count": 7,
          "is_numeric": true,
          "is_categorical": false,
          "is_datetime": false,
          "is_constant": false,
          "has_nulls": false
        },
        {
          "name": "Parch",
          "dtype": "int64",
          "sample_values": [
            "0",
            "0",
            "0",
            "0",
            "0"
          ],
          "unique_count": 7,
          "is_numeric": true,
          "is_categorical": false,
          "is_datetime": false,
          "is_constant": false,
          "has_nulls": false
        },
        {
          "name": "Ticket",
          "dtype": "object",
          "sample_values": [
            "A/5 21171",
            "PC 17599",
            "STON/O2. 3101282",
            "113803",
            "373450"
          ],
          "unique_count": 681,
          "is_numeric": false,
          "is_categorical": false,
          "is_datetime": false,
          "is_constant": false,
          "has_nulls": false
        },
        {
          "name": "Fare",
          "dtype": "float64",
          "sample_values": [
            "7.25",
            "71.2833",
            "7.925",
            "53.1",
            "8.05"
          ],
          "unique_count": 248,
          "is_numeric": true,
          "is_categorical": false,
          "is_datetime": false,
          "is_constant": false,
          "has_nulls": false
        },
        {
          "name": "Cabin",
          "dtype": "object",
          "sample_values": [
            "C85",
            "C123",
            "E46",
            "G6",
            "C103"
          ],
          "unique_count": 147,
          "is_numeric": false,
          "is_categorical": true,
          "is_datetime": false,
          "is_constant": false,
          "has_nulls": true
        },
        {
          "name": "Embarked",
          "dtype": "object",
          "sample_values": [
            "S",
            "C",
            "S",
            "S",
            "S"
          ],
          "unique_count": 3,
          "is_numeric": false,
          "is_categorical": true,
          "is_datetime": false,
          "is_constant": false,
          "has_nulls": true
        }
      ],
      "numeric_summary": [
        {
          "name": "PassengerId",
          "mean": 446,
          "std": 257.3538420152301,
          "min": 1,
          "max": 891,
          "median": 446,
          "q1": 223.5,
          "q3": 668.5,
          "iqr": 445,
          "skewness": 0,
          "kurtosis": -1.1999999999999997,
          "zero_count": 0,
          "zero_percent": 0,
          "outlier_count": 0,
          "outlier_percent": 0,
          "is_normal": false
        },
        {
          "name": "Survived",
          "mean": 0.3838383838383838,
          "std": 0.4865924542648575,
          "min": 0,
          "max": 1,
          "median": 0,
          "q1": 0,
          "q3": 1,
          "iqr": 1,
          "skewness": 0.4785234382949897,
          "kurtosis": -1.775004671066304,
          "zero_count": 549,
          "zero_percent": 61.61616161616161,
          "outlier_count": 0,
          "outlier_percent": 0,
          "is_normal": false
        },
        {
          "name": "Pclass",
          "mean": 2.308641975308642,
          "std": 0.836071240977049,
          "min": 1,
          "max": 3,
          "median": 3,
          "q1": 2,
          "q3": 3,
          "iqr": 1,
          "skewness": -0.6305479068752845,
          "kurtosis": -1.2800149715782825,
          "zero_count": 0,
          "zero_percent": 0,
          "outlier_count": 0,
          "outlier_percent": 0,
          "is_normal": false
        },
        {
          "name": "Age",
          "mean": 29.69911764705882,
          "std": 14.526497332334042,
          "min": 0.42,
          "max": 80,
          "median": 28,
          "q1": 20.125,
          "q3": 38,
          "iqr": 17.875,
          "skewness": 0.38910778230082704,
          "kurtosis": 0.17827415364210353,
          "zero_count": 0,
          "zero_percent": 0,
          "outlier_count": 11,
          "outlier_percent": 1.2345679012345678,
          "is_normal": false
        },
        {
          "name": "SibSp",
          "mean": 0.5230078563411896,
          "std": 1.1027434322934317,
          "min": 0,
          "max": 8,
          "median": 0,
          "q1": 0,
          "q3": 1,
          "iqr": 1,
          "skewness": 3.6953517271630565,
          "kurtosis": 17.880419726645968,
          "zero_count": 608,
          "zero_percent": 68.23793490460157,
          "outlier_count": 46,
          "outlier_percent": 5.16273849607183,
          "is_normal": false
        },
        {
          "name": "Parch",
          "mean": 0.38159371492704824,
          "std": 0.8060572211299483,
          "min": 0,
          "max": 6,
          "median": 0,
          "q1": 0,
          "q3": 0,
          "iqr": 0,
          "skewness": 2.7491170471010933,
          "kurtosis": 9.778125179021648,
          "zero_count": 678,
          "zero_percent": 76.0942760942761,
          "outlier_count": 213,
          "outlier_percent": 23.905723905723907,
          "is_normal": false
        },
        {
          "name": "Fare",
          "mean": 32.204207968574636,
          "std": 49.6934285971809,
          "min": 0,
          "max": 512.3292,
          "median": 14.4542,
          "q1": 7.9104,
          "q3": 31,
          "iqr": 23.0896,
          "skewness": 4.787316519674893,
          "kurtosis": 33.39814088089868,
          "zero_count": 15,
          "zero_percent": 1.6835016835016834,
          "outlier_count": 116,
          "outlier_percent": 13.019079685746352,
          "is_normal": false
        }
      ],
      "categorical_summary": [
        {
          "name": "Sex",
          "unique_count": 2,
          "top_values": [
            {
              "value": "male",
              "count": 577
            },
            {
              "value": "female",
              "count": 314
            }
          ],
          "high_cardinality": false,
          "entropy": 0.6489276088957644,
          "is_uniform": false
        },
        {
          "name": "Cabin",
          "unique_count": 147,
          "top_values": [
            {
              "value": "B96 B98",
              "count": 4
            },
            {
              "value": "G6",
              "count": 4
            },
            {
              "value": "C23 C25 C27",
              "count": 4
            },
            {
              "value": "C22 C26",
              "count": 3
            },
            {
              "value": "F33",
              "count": 3
            },
            {
              "value": "F2",
              "count": 3
            },
            {
              "value": "E101",
              "count": 3
            },
            {
              "value": "D",
              "count": 3
            },
            {
              "value": "C78",
              "count": 2
            },
            {
              "value": "C93",
              "count": 2
            }
          ],
          "high_cardinality": true,
          "entropy": 4.897561648814725,
          "is_uniform": null
        },
        {
          "name": "Embarked",
          "unique_count": 3,
          "top_values": [
            {
              "value": "S",
              "count": 644
            },
            {
              "value": "C",
              "count": 168
            },
            {
              "value": "Q",
              "count": 77
            }
          ],
          "high_cardinality": false,
          "entropy": 0.7602918973432804,
          "is_uniform": false
        }
      ],
      "missing_data": [
        {
          "column": "Age",
          "count": 177,
          "percent": 19.865319865319865
        },
        {
          "column": "Cabin",
          "count": 687,
          "percent": 77.10437710437711
        },
        {
          "column": "Embarked",
          "count": 2,
          "percent": 0.22446689113355783
        }
      ],
      "correlation_matrix": {
        "columns": [
          "PassengerId",
          "Survived",
          "Pclass",
          "Age",
          "SibSp",
          "Parch",
          "Fare"
        ],
        "values": [
          [
            1,
            -0.005006660767066571,
            -0.035143994030381084,
            0.036847197861327737,
            -0.05752683378444152,
            -0.0016520124027188268,
            0.012658219287491099
          ],
          [
            -0.005006660767066571,
            1,
            -0.3384810359610151,
            -0.07722109457217756,
            -0.0353224988857356,
            0.08162940708348336,
            0.2573065223849626
          ],
          [
            -0.035143994030381084,
            -0.3384810359610151,
            1,
            -0.36922601531551746,
            0.08308136284568687,
            0.018442671310748508,
            -0.5494996199439075
          ],
          [
            0.036847197861327737,
            -0.07722109457217756,
            -0.36922601531551746,
            1,
            -0.3082467589236568,
            -0.1891192626320352,
            0.09606669176903915
          ],
          [
            -0.05752683378444152,
            -0.0353224988857356,
            0.08308136284568687,
            -0.3082467589236568,
            1,
            0.41483769862015635,
            0.159651043242161
          ],
          [
            -0.0016520124027188268,
            0.08162940708348336,
            0.018442671310748508,
            -0.1891192626320352,
            0.41483769862015635,
            1,
            0.2162249447707645
          ],
          [
            0.012658219287491099,
            0.2573065223849626,
            -0.5494996199439075,
            0.09606669176903915,
            0.159651043242161,
            0.2162249447707645,
            1
          ]
        ],
        "high_correlation_pairs": []
      },
      "target": null,
      "highlights": [
        "Dataset contains 12 columns and 891 rows",
        "1 columns have >20% missing values",
        "Age has 1.2% outliers",
        "SibSp is right-skewed",
        "SibSp has 5.2% outliers",
        "Parch is right-skewed",
        "Parch has 23.9% outliers",
        "Fare is right-skewed",
        "Fare has 13.0% outliers",
        "1 columns have high cardinality"
      ],
      "gpt_insights": {
        "summary": "This will be GPT summary",
        "column_descriptions": {
          "PassengerId": "This will be GPT description for PassengerId",
          "Survived": "This will be GPT description for Survived",
          "Pclass": "This will be GPT description for Pclass",
          "Name": "This will be GPT description for Name",
          "Sex": "This will be GPT description for Sex",
          "Age": "This will be GPT description for Age",
          "SibSp": "This will be GPT description for SibSp",
          "Parch": "This will be GPT description for Parch",
          "Ticket": "This will be GPT description for Ticket",
          "Fare": "This will be GPT description for Fare",
          "Cabin": "This will be GPT description for Cabin",
          "Embarked": "This will be GPT description for Embarked"
        },
        "insight_explanations": [
          {
            "highlight": "Dataset contains 12 columns and 891 rows",
            "explanation": "This will be GPT explanation for: Dataset contains 12 columns and 891 rows"
          },
          {
            "highlight": "1 columns have >20% missing values",
            "explanation": "This will be GPT explanation for: 1 columns have >20% missing values"
          },
          {
            "highlight": "Age has 1.2% outliers",
            "explanation": "This will be GPT explanation for: Age has 1.2% outliers"
          },
          {
            "highlight": "SibSp is right-skewed",
            "explanation": "This will be GPT explanation for: SibSp is right-skewed"
          },
          {
            "highlight": "SibSp has 5.2% outliers",
            "explanation": "This will be GPT explanation for: SibSp has 5.2% outliers"
          },
          {
            "highlight": "Parch is right-skewed",
            "explanation": "This will be GPT explanation for: Parch is right-skewed"
          },
          {
            "highlight": "Parch has 23.9% outliers",
            "explanation": "This will be GPT explanation for: Parch has 23.9% outliers"
          },
          {
            "highlight": "Fare is right-skewed",
            "explanation": "This will be GPT explanation for: Fare is right-skewed"
          },
          {
            "highlight": "Fare has 13.0% outliers",
            "explanation": "This will be GPT explanation for: Fare has 13.0% outliers"
          },
          {
            "highlight": "1 columns have high cardinality",
            "explanation": "This will be GPT explanation for: 1 columns have high cardinality"
          }
        ],
        "suggested_analyses": [
          {
            "type": "correlation",
            "description": "This will be GPT suggestion for correlation analysis",
            "reason": "This will be GPT reasoning"
          },
          {
            "type": "distribution",
            "description": "This will be GPT suggestion for distribution analysis",
            "reason": "This will be GPT reasoning"
          }
        ]
      },
      "data_dictionary": null
    },
    "cache_info": {
      "cached": true,
      "cache_key": "session:dc56ebdd-b1ff-40b0-a4cc-17bbff798282:overview",
      "ttl": null
    }
  }