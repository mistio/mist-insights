import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-styles/paper-styles.js";
import "@polymer/paper-material/paper-material.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-spinner/paper-spinner.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/iron-media-query/iron-media-query.js";
import { IronResizableBehavior } from "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import moment from 'moment/src/moment.js';
import * as echarts from  'echarts/echarts.all.js';

/**
`mist-insights`
usage example:
    <mist-insights
        period="month"
        stack-term="deployment"
        cloud="cloud_id"
        uri="http://localhost"
        token="token_string"
        currency=[[currency]]>
    </mist-insights>

period: month, day, week, quarter
filter: cloud="cloud_id"
        stack="stack_id"
        tag="tag"
stack-term="deployment"
currency: Object ex1. {sign: "$", rate: 1}, ex2. {sign: '₹', rate:0.014}

@demo demo/index.html
*/
/* 
css on parent: 
mist-insights {
        /*--insights-general-font*\/
        --insights-general-font-font-family: 'Roboto', 'Noto', sans-serif;
        --insights-general-font-font-size: 16px;
        --insights-general-font-line-height: 1.8em;
        --insights-general-font-color: rgba(0,0,0,0.87);

        /*--insights-h2*\/
        --insights-h2-font-size: 2.4em;
        --insights-h2-margin: 0 !important;
        --insights-h2-font-weight: 400;
        --insights-h2-letter-spacing: 0;
        --insights-h2-line-height: 48px;

        /*--insights-h2-title*\/
        --insights-h2-title-font-size: 1.6em;
        --insights-h2-title-margin: 0 !important;

        /*--insights-legends*\/
        --insights-legends-text-transform: uppercase;
        --insights-legends-font-size: 0.9em;
        --insights-legends-color: rgba(0,0,0,0.54);
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then adding: 24px;
        --material-css-margin-bottom: 16px;
        --paper-material-bg-color: #fff;
        --paper-material-box-shadow: 0 none;

        --red-color: #e82438;
        --green-color: #38b549;
      }
 */
const COST_GRAPH_OPTIONS = {
    tooltip: {
        trigger: 'axis',
        // formatter: "{a}{b}:{c}",
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data: ['Cost per month']
    },
    grid: {
        top: '4%',
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
    },
    xAxis: [{
        type: 'time',
        splitLine: {
            show: false
        },
        // axisLabel: {
        //     formatter: function (value, index) {
        //         if (index == 0)
        //             return echarts.format.formatTime('yyyy-MM-dd hh:mm', value)
        //         return echarts.format.formatTime('hh:mm:ss', value)
        //     }
        // }
    }],
    yAxis: [{
        type: 'value'
    }],
    series: [{
        name: 'Cost',
        type: 'line',
        stack: 'f',
        areaStyle: {
            normal: {
                color: "rgba(0,155,155,0.2)"
            }
        },
        lineStyle: {
            normal: {
                color: "rgba(0,155,155,1)"
            }
        },
        itemStyle: {
            normal: {
                borderColor: "rgba(0,155,155,1)"
            }
        },
        data: []
    }]
};
const DRILL_COST_GRAPH_OPTIONS = {
    tooltip: {
        trigger: 'item'
        // formatter: "{b} {a}: <br/>${c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data: []
    },
    series: [{
        name: 'Cost',
        type: 'pie',
        center: ['65%', '40%'],
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
            normal: {
                show: false,
                position: 'center'
            },
            emphasis: {
                show: true,
                textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold',
                    textBorderColor: '#fff',
                    textBorderWidth: 1
                }
            }
        },
        labelLine: {
            normal: {
                show: false
            }
        },
        data: [1, 2, 3]
    }]
};
const USAGE_GRAPH_OPTIONS = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data: [{
            name: 'Load',
            textStyle: "rgba(0,155,155,1)",
        }, {
            name: 'Cores',
            textStyle: "rgba(250,128,114,1)",
        }]
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
    },
    xAxis: [{
        type: 'time',
        splitLine: {
            show: false
        }
    }],
    yAxis: [{
        type: 'value'
    }],
    series: [{
            name: 'Cores',
            type: 'line',
            stack: 'f',
            areaStyle: {
                normal: {
                    color: "rgba(0,155,155,0.2)"
                }
            },
            lineStyle: {
                normal: {
                    color: "rgba(0,155,155,1)"
                }
            },
            itemStyle: {
                normal: {
                    borderColor: "rgba(0,155,155,1)"
                }
            },
            data: []
        },
        {
            name: 'Load',
            type: 'line',
            stack: 'g',
            areaStyle: {
                normal: {
                    color: "rgba(250,128,114,0.2)"
                }
            },
            lineStyle: {
                normal: {
                    color: "rgba(250,128,114,1)"
                }
            },
            itemStyle: {
                normal: {
                    borderColor: "rgba(250,128,114,1)"
                }
            },
            data: []
        }
    ]
};
const MACHINES_GRAPH_OPTIONS = {
    borderColor: ["rgba(0,155,155,1)"],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        top: '4%',
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
    },
    xAxis: [{
        type: 'time',
        axisTick: {
            alignWithLabel: true
        },
        splitLine: {
            show: false
        }
    }],
    yAxis: [{
        type: 'value'
    }],
    series: [{
        name: 'machines',
        type: 'line',
        // step: 'middle',
        areaStyle: {
            normal: {
                color: "rgba(0,155,155,0.2)"
            }
        },
        lineStyle: {
            normal: {
                color: "rgba(0,155,155,1)"
            }
        },
        itemStyle: {
            normal: {
                borderColor: "rgba(0,155,155,1)"
            }
        },
        data: []
    }]
};
Polymer({
  _template: html`
        <style include="iron-flex iron-flex-alignment iron-flex-factors">
        :host {
            display: block;
            /*--insights-general-font: {
                    font-family: 'Roboto', 'Noto', sans-serif;
                    font-size: 16px;
                    line-height: 1.8em;
                    color: rgba(0,0,0,0.87);
                };

                --insights-h2: {
                    font-size: 2.4em;
                    margin: 0 !important;
                    font-weight: 400;
                    letter-spacing: 0;
                    line-height: 48px;
                };

                --insights-h2-title: {
                    font-size: 1.6em;
                    margin: 0 !important;
                };

                --insights-legends: {
                    text-transform: uppercase;
                    font-size: 0.9em;
                    color: rgba(0,0,0,0.54);
                }

                --material-css: {
                    padding: 24px;
                    margin-bottom: 16px;
                }*/
            /*@apply --insights-general-font;*/
            font-family: var(--insights-general-font-font-family);
            font-size: var(--insights-general-font-font-size);
            line-height: var(--insights-general-font-line-height);
            color: var(--insights-general-font-color);
        }

         :host(.cloudify) {
            /*--insights-general-font*/
            --insights-general-font-font-size: 14px;
            --insights-general-font-line-height: 1.8em;
            --insights-general-font-color: rgba(0, 0, 0, 0.87);

            /*--insights-h2*/
            --insights-h2-font-size: 2.4em;
            --insights-h2-margin: 0 !important;
            --insights-h2-font-weight: 400;
            --insights-h2-letter-spacing: 0;
            --insights-h2-line-height: 48px;

            /*--insights-h2-title*/
            --insights-h2-title-font-size: 1em;
            --insights-h2-title-margin: 0 !important;

            /*--insights-legends*/
            --insights-legends-text-transform: uppercase;
            --insights-legends-font-size: 0.9em;
            --insights-legends-color: rgba(0, 0, 0, 0.54);

            /* dropdown */
            --paper-font-subhead_-_font-size: 14px;
            --paper-item-min-height: 37px;

            /*--material-css*/
            --material-css-padding: 8px 0;
            --material-css-margin-bottom: 16px;

            --red-color: #e82438;
            --green-color: #38b549;

            --paper-input-container: {
                border: 1px solid #ddd;
                padding: 0 8px;
                border-radius: 3px;
            }
            paper-item: {
                padding: 11px 14px;
            }
            --material-shadow: {
                @apply --shadow-none;
            }
            --paper-listbox: {
                /*@apply --shadow-none;*/
                width: 210px;
                border: 1px solid #81BCD4;
                margin: 0;
                padding: 0;
                border-radius: 3px;
            }
            --paper-input-container-color: transparent;
            --paper-input-container-focus-color: transparent;
            --paper-input-container-invalid-color: transparent;
            --paper-listbox_-_width: 186px;
            --insights-legends-text-transform: none;
        }

        :host(.cloudify) paper-input-container:hover {
            border-color: rgba(34, 36, 38, .35);
        }

        :host(.cloudify) .smaller {
            text-transform: none;
            font-size: 14px;
            color: black;
            font-weight: 700;
        }

        :host(.cloudify) .infotext {
            text-transform: none;
            font-size: 14px;
            color: black;
        }

        :host(.cloudify) h2 {
            font-weight: bold;
            text-transform: none;
        }

        :host paper-button.clear {
            padding: 3px;
            white-space: nowrap;
        }

        :host(.cloudify) paper-material.section+paper-material {
            border-top: 1px solid #ddd;
        }

        :host(.cloudify) paper-button.clear {
            color: rgba(0, 0, 0, .6);
            box-shadow: 0 0 0 1px rgba(34, 36, 38, .15) inset;
            border-radius: 3px;
            padding: 3px 12px;
            display: inline-block;
            vertical-align: bottom;
        }

        :host(.cloudify) paper-button.clear iron-icon {
            width: 16px;
            margin-right: 8px;
        }

        h2 {
            /*@apply --insights-h2;*/
            font-size: var(--insights-h2-font-size);
            margin: var(--insights-h2-margin);
            font-weight: var(--insights-h2-font-weight);
            letter-spacing: var(--insights-h2-letter-spacing);
            line-height: var(--insights-h2-line-height);
        }

        .head {
            display: flex;
        }

        h2.title {
            /*@apply --insights-h2-title;*/
            font-size: var(--insights-h2-title-font-size);
            margin: var(--insights-h2-title-margin);
            padding: var(--insights-h2-title-padding);
            border-bottom: var(--insights-h2-border-bottom);
        }

        *[hidden] {
            display: none;
        }

        #quick-overview {
            margin: var(--insights-quick-overview-margin);
        }

        #graphRow[largescreen] {
            display: flex;
        }

        #graphRow[largescreen] .block+.block {
            padding-left: 48px;
        }

        .graph {
            width: 100%;
            min-height: 300px;
            margin-bottom: 40px;
        }

        .smaller, .infotext, .subtitle {
            /*@apply --insights-legends;*/
            text-transform: var(--insights-legends-text-transform);
            font-size: var(--insights-legends-font-size);
            color: var(--insights-legends-color);
        }

        .subtitle {
        }

        .secondary {
            opacity: 0.54;
            font-size: 0.9rem;
            display: inline-block;
            font-weight: 300;
        }

        .uppercase,
        paper-dropdown-menu.uppercase paper-item,
        paper-dropdown-menu.uppercase ::content #input {
            text-transform: uppercase;
        }

        .lowercase {
            text-transform: lowercase;
        }

        .current-value {
            text-align: right;
            padding-left: 36px;
        }

        paper-listbox#filterbyType paper-item {
            text-transform: capitalize;
        }

        paper-material {
            position: relative;
            display: block;
            /*@apply --material-css;*/
            @apply --material-shadow;
            padding: var(--material-css-padding);
            background-color: var(--paper-material-bg-color, #fff);
            box-shadow: var(--paper-material-box-shadow, var(--shadow-elevation-2dp_-_box-shadow));
        }

        paper-material.margin-bottom {
            margin-bottom: var(--material-css-margin-bottom);
        }

        paper-spinner {
            margin: 10% calc(50% - 40px);
            width: 80px !important;
            height: 80px !important;
        }

        .red,
        .above {
            color: var(--red-color);
        }

        .green,
        .below {
            color: var(--green-color);
        }

        .infotext .arrow > iron-icon {
            width: 16px;
            height: 16px;
            vertical-align: text-top;
        }

        .sup {
            vertical-align: super;
            font-size: 0.55em;
            opacity: 0.34;
        }

        .opaque {
            opacity: 0.34
        }

        .graphArea {
            position: relative;
        }

        .no-data {
            font-style: italic;
        }

        .graphArea .no-data {
            text-align: center;
            position: absolute;
            top: 40%;
            width: 100%;
        }

        .filterby {
            display: inline-block;
        }

        .highlight {
            background-color: #ffff8d;
            padding: 2px;
        }

        .loading-data {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.9);
            width: 100%;
            height: 100%;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 2;
        }

        .filter {
            padding: 0 16px 0 0;
        }

        #filtering .container {
            align-items: flex-end;
        }

        .machines-column {
            opacity: 0.54;
            padding-right: 16px;
            text-align: left;

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            text-align-last: right;
        }

        .cost-column {
            text-align: right;
            width: 30%;
        }

        .list {
            margin-top: 16px;
            margin-bottom: 32px;
            min-width: 300px;
        }

        .tag {
            vertical-align: middle;
            line-height: 1.6em;
            display: inline-block;
            background-color: #888;
            color: #fff;
            font-size: 14px;
            padding: 0 0.5em;
            margin: 0 1px;
            border-radius: 2px;
            letter-spacing: .4px;
            font-weight: 400;
            word-break: break-all;
            max-width: 250px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .tag.hidden-true {
            padding: 0;
        }

        .comparative {
            margin-bottom: 24px;
        }

        #test .test {
            margin: 20px;
            background-color: #eee;
        }

        .index {
            margin-right: 4px;
        }

        .flexchild {
            @apply(--layout-flex);
        }
        .inline {
            display: inline;
        }
        .infotext.inline {
            padding-right: 8px;
        }
        .infotext.inline + .infotext.inline {
            border-left: 1px solid #ddd; 
            padding-left: 16px;
        }
        [hidden] {
            display: none;
        }
        </style>
        <iron-media-query query="(min-width: 1180px)" query-matches="{{largescreen}}"></iron-media-query>
        <paper-material id="filtering" class="margin-bottom section">
            <div class="container layout horizontal start">
                <div class="filter flex-1 self-start">
                    <div class="smaller">Time</div>
                    <paper-dropdown-menu no-label-float="" noink="">
                        <paper-listbox id="window" slot="dropdown-content" class="dropdown-content" attr-for-selected="value" selected="{{timeParams.window}}">
                            <paper-item value="hour">hourly</paper-item>
                            <paper-item value="day">daily</paper-item>
                            <paper-item value="week">weekly</paper-item>
                            <paper-item value="month">monthly</paper-item>
                            <paper-item value="quarter">quarterly</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu no-label-float="" noink="">
                        <paper-listbox id="past" slot="dropdown-content" class="dropdown-content" attr-for-selected="value" selected="{{timeParams.past}}">
                            <template is="dom-repeat" items="{{pastItems}}" as="past">
                                <paper-item value="[[past.value]]">[[past.text]]</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                </div>
                <div class="filter flex-1" hidden\$="[[!allowFilter]]">
                    <div class="smaller">Filter by</div>
                    <paper-dropdown-menu no-label-float="" noink="">
                        <paper-listbox id="filterbyType" slot="dropdown-content" class="dropdown-content" attr-for-selected="value" selected="{{filterby.type}}">
                            <paper-item value="stack">[[stackTerm]]</paper-item>
                            <paper-item value="cloud">Cloud</paper-item>
                            <paper-item value="tag">Tag</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu id="filterbyNameDd" no-label-float="" noink="">
                        <paper-listbox id="filterbyName" slot="dropdown-content" class="dropdown-content" attr-for-selected="value" selected="{{filterby.id}}">
                            <template is="dom-repeat" items="{{filterbyItems}}">
                                <paper-item value="[[item.id]]" data-name\$="[[item.name]]">[[item.name]]</paper-item>
                            </template>
                            <paper-item disabled="" hidden\$="[[!filterbyDisable]]">
                                <span hidden\$="[[!filterby.type]]">no [[_display(filterby.type)]]s</span>
                                <span hidden\$="[[filterby.type.length]]">Select type</span>
                            </paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-button class="inline baseline smaller clear" on-tap="clearFilter" disabled\$="[[!filterby.id.length]]" hidden\$="[[!showClear]]" noink="">
                        <iron-icon icon="clear"></iron-icon>Clear
                    </paper-button>
                </div>
                <paper-icon-button on-tap="_exportPdf" icon="image:picture-as-pdf"></paper-icon-button>
            </div>
        </paper-material>
        <paper-material id="quick-overview" class="margin-bottom section">
            <div class="loading-data" hidden\$="{{!loadingDataCost}}">
            </div>
            <div id="quick-overview-data" class="quick-overview container layout horizontal">
                <div id="quick-overview-cost" class="flex-1">
                    <div class="smaller">Cost</div>
                    <h2 class="cost" hidden\$="[[isNull(costReport.cost)]]"><span class="sup">[[currency.sign]]</span>[[_convertCurrency(costReport.cost,currency.rate,2)]]</h2>
                    <div class="no-data" hidden\$="[[!isNull(costReport.cost)]]">No data</div>
                    <div class="smaller" hidden\$="[[isNull(costReport.comparative_cost)]]">
                        <span class\$="[[percentageSignToText(costReport.comparative_cost)]]">
                            <span hidden\$="[[!costReport.comparative_cost]]">[[abs(costReport.comparative_cost)]]%</span>
                            [[percentageSignToText(costReport.comparative_cost)]]
                        </span>
                        previous [[timeParams.window]]
                    </div>
                </div>
                <div id="quick-overview-machine_count" class="flex-1">
                    <div class="smaller">Machine Count</div>
                    <h2 class="cost" hidden\$="[[isNull(costReport.machine_count.unique)]]"><span class="sup">&nbsp;</span>[[costReport.machine_count.unique]]</h2>
                    <div class="no-data" hidden\$="[[!isNull(costReport.machine_count.unique)]]">No data</div>
                    <div class="smaller" hidden\$="[[isNull(costReport.comparative_machine_count.unique)]]">
                        <span class\$="[[percentageSignToText(costReport.comparative_machine_count.unique)]]">
                            <span hidden\$="[[!costReport.comparative_machine_count.unique]]">[[abs(costReport.comparative_machine_count.unique)]]%</span>
                            [[percentageSignToText(costReport.comparative_machine_count.unique)]]
                        </span>
                        previous [[timeParams.window]]
                    </div>
                </div>
                <div id="quick-overview-average_load" class="flex-1">
                    <div class="smaller">Average load</div>
                    <h2 class="cost" hidden\$="[[isNull(usageReport.load.mean)]]"><span class="sup">&nbsp;</span>[[usageReport.load.mean]]</h2>
                    <div class="no-data" hidden\$="[[!isNull(usageReport.load.mean)]]">No data</div>
                    <div class="smaller" hidden\$="[[isNull(usageReport.comparative_load.mean)]]">
                        <span class\$="[[percentageSignToText(usageReport.comparative_load.mean)]]">
                            <span hidden\$="[[!usageReport.comparative_load.mean]]">[[abs(usageReport.comparative_load.mean)]] </span>
                            [[percentageSignToText(usageReport.comparative_load.mean)]]
                        </span>
                        previous [[timeParams.window]]
                    </div>
                </div>
            </div>
        </paper-material>
        <paper-material id="cost_overview">
            <div class="loading-data" hidden\$="{{!loadingDataCost}}"></div>
            <div class="head">
                <div class="flexchild">
                    <h2 class="title">Cost Overview</h2>
                    <div class="filterby highlight" hidden\$="[[!filterby.type.length]]">
                        <span class="uppercase">for [[_display(filterby.type)]]:</span><span class="uppercase [[filterby.type]]"> [[filterby.name]] <span hidden\$="[[filterby.id.length]]">select [[_display(filterby.type)]]</span>
                    </span></div>
                    <div class="filterby highlight" hidden\$="[[filterby.type.length]]">All infrastructure</div>
                </div>
                <div class="current-value">
                    <div class="subtitle smaller">Cost [[timeToText(pastItems,timeParams.past)]]</div>
                    <h2 class="cost"><span class="sup">[[currency.sign]]</span>[[_convertCurrency(costReport.cost,currency.rate,2)]]</h2>
                </div>
            </div>
        </paper-material>
        <paper-material id="graphRow" class="margin-bottom section">
            <div class="loading-data" hidden\$="{{!loadingDataCost}}">
                <paper-spinner active="{{loadingDataCost}}"></paper-spinner>
            </div>
            <div>
                <div class="comparative flexchild" hidden\$="[[isEmpty(costReport.history)]]">
                    <div class="infotext inline">
                        <strong>[[currency.sign]][[lastValue(costReport.history,'cost_per_month')]]</strong><span class="lowercase">/month</span> run rate
                    </div>
                    <div class="infotext inline" hidden\$="[[isNull(costReport.comparative_cost)]]">
                        <span class\$="[[percentageSignToText(costReport.comparative_cost)]]">
                            <span hidden\$="[[!costReport.comparative_cost]]">[[abs(costReport.comparative_cost)]]%</span>
                            [[percentageSignToText(costReport.comparative_cost)]]
                        </span>
                        previous [[timeParams.window]]
                    </div>
                    <div class="infotext inline"> Cost max: [[currency.sign]][[_convertCurrency(costReport.cost_per_month.max,currency.rate,2)]]/<span class="lowercase">month</span>,
                        avg: [[currency.sign]][[_convertCurrency(costReport.cost_per_month.mean,currency.rate,2)]]/<span class="lowercase">month</span>,
                        min: [[currency.sign]][[_convertCurrency(costReport.cost_per_month.min,currency.rate,2)]]/<span class="lowercase">month</span>
                    </div>
                </div>
                <div class="layout horizontal wrap">
                    <div class="graphArea flex-1">
                        <div class="smaller">Run Rate ([[currency.sign]]/<span class="lowercase">month</span>)</div>
                        <div class="no-data" hidden\$="[[!isEmpty(costReport.history)]]">No cost data available</div>
                        <div id="costGraph" class="graph" style\$="width: [[costWidth]]px;"></div>
                    </div>
                    <div class="flex-1 layout vertical">
                        <div class="horizontal layout wrap">
                            <div class="flex-1">
                                <div class="smaller">Cost by Cloud</div>
                                <div id="drillcostgraph" class="graph" style\$="width: [[drillCostWidth]]px;"></div>
                            </div>
                            <div class="flex-1">
                                <div id="costListByCloud" class="flex" hidden\$="{{!costListByCloud}}">
                                    <div class="list">
                                        <template is="dom-repeat" items="{{costListByCloud}}">
                                            <div class="layout horizontal">
                                                <span class="index">[[_index(index)]]. </span>
                                                <span class="flexchild name-col flex-2">
                                                [[item.name]]
                                            </span>
                                                <div class="machines-column flex-1" title="machines">
                                                    [[item.machine_count.unique]] machines
                                                </div>
                                                <span class="cost-column">
                                                [[currency.sign]][[_convertCurrency(item.cost,currency.rate,2)]]
                                            </span>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div id="costListByStack" class="flex" hidden\$="{{!costListByStack}}">
                                <div class="smaller">Cost by [[stackTerm]]</div>
                                <div class="list">
                                    <template is="dom-repeat" items="{{costListByStack}}">
                                        <div class="layout horizontal">
                                            <span class="index">[[_index(index)]]. </span>
                                            <span class="flexchild name-col flex-2">
                                            [[item.name]]
                                            <span hidden\$="[[item.name.length]]">
                                                not in a [[stackTerm]]
                                            </span>
                                            </span>
                                            <div class="machines-column flex-1" title="machines">
                                                [[item.machine_count.unique]] machines
                                            </div>
                                            <span class="cost-column">
                                            [[currency.sign]][[_convertCurrency(item.cost,currency.rate,2)]]
                                        </span>
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <div id="costListByTag" class="flex" hidden\$="{{!costListByTag}}">
                                <div class="smaller">Cost by Tag</div>
                                <div class="list">
                                    <template is="dom-repeat" items="{{costListByTag}}">
                                        <div class="layout horizontal">
                                            <span class="index">[[_index(index)]]. </span>
                                            <span class="flexchild name-col flex-2">
                                            <span hidden\$="[[!item.name.length]]" class\$="tag hidden-[[!item.name.length]]">[[item.name]]</span>
                                            <span hidden\$="[[item.name.length]]">
                                                untagged
                                            </span>
                                            </span>
                                            <div class="machines-column flex-1" title="machines">
                                                [[item.machine_count.unique]] machines
                                            </div>
                                            <span class="cost-column">
                                                [[currency.sign]][[_convertCurrency(item.cost,currency.rate,2)]]
                                            </span>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </paper-material>
        <paper-material id="utilization_overview">
            <div class="loading-data" hidden\$="{{!loadingDataUsage}}"></div>
            <div class="loading-data" hidden\$="{{!loadingDataCost}}"></div>
            <div class="head">
                <div class="flexchild">
                    <h2 class="title">Utilization Overview <span class="secondary">* for monitored machines only</span></h2>
                    <div class="filterby highlight" hidden\$="[[!filterby.type.length]]">
                        <span class="uppercase">for [[_display(filterby.type)]]:</span><span class="uppercase [[filterby.type]]"> [[filterby.name]] <span hidden\$="[[filterby.id.length]]">select [[_display(filterby.type)]]</span>
                    </span></div>
                    <div class="filterby highlight" hidden\$="[[filterby.type.length]]">All infrastructure</div>
                </div>
                <div class="current-value" hidden\$="[[isEmpty(usageReport.history)]]">
                    <div class="subtitle smaller">Maximum</div>
                    <h2 class="cost">[[usageReport.load.max]]</h2>
                </div>
                <div class="current-value" hidden\$="[[isEmpty(usageReport.history)]]">
                    <div class="subtitle smaller">Minimum</div>
                    <h2 class="cost">[[usageReport.load.min]]</h2>
                </div>
                <div class="current-value" hidden\$="[[isEmpty(usageReport.history)]]">
                    <div class="subtitle smaller">Average Load</div>
                    <h2 class="cost">[[usageReport.load.mean]]</h2>
                </div>
            </div>
        </paper-material>
        <paper-material id="average_load" class="margin-bottom section">
            <div class="loading-data" hidden\$="{{!loadingDataCost}}"></div>
            <div class="loading-data" hidden\$="{{!loadingDataUsage}}">
                <paper-spinner active="{{loadingDataUsage}}"></paper-spinner>
            </div>
            <div>
                <div class="comparative flexchild" hidden\$="[[!usageReport.history.length]]">
                    <div class="infotext inline" hidden\$="[[isNull(usageReport.load.mean)]]"><strong>[[_formatLargeNumber(usageReport.load.mean)]]</strong> average load on <strong>[[_formatLargeInteger(usageReport.cores.mean)]]</strong> cores [[timeToText(pastItems,timeParams.past)]]</div>

                    <div class="infotext inline" hidden\$="[[isNull(usageReport.comparative_load.mean)]]">
                        <span class\$="[[percentageSignToText(usageReport.comparative_load.mean)]]">
                            <span hidden\$="[[!usageReport.comparative_load.mean]]">[[abs(usageReport.comparative_load.mean)]]%</span>
                            [[percentageSignToText(usageReport.comparative_load.mean)]]
                        </span>
                        previous [[timeParams.window]]
                    </div>

                    <div class="infotext inline">
                        <span hidden\$="[[isNull(usageReport.load.max)]]">
                            Load max: [[_formatLargeNumber(usageReport.load.max)]]
                            <span class\$="[[percentageSignToText(usageReport.comparative_load.max)]] arrow"><iron-icon icon\$="[[percentageSignToArrow(usageReport.comparative_load.max)]]" title\$="[[_formatLargeNumber(usageReport.comparative_load.max)]]% change"></iron-icon></span>
                        </span>,

                        <span hidden\$="[[isNull(usageReport.load.min)]]">
                            min: [[_formatLargeNumber(usageReport.load.min)]]
                            <span class\$="[[percentageSignToText(usageReport.comparative_load.min)]] arrow"><iron-icon icon\$="[[percentageSignToArrow(usageReport.comparative_load.min)]]" title\$="[[_formatLargeNumber(usageReport.comparative_load.min)]]% change"></iron-icon></span>
                        </span>,

                        <span hidden\$="[[isNull(usageReport.load.mean)]]">
                            avg: [[_formatLargeNumber(usageReport.load.mean)]]
                            <span class\$="[[percentageSignToText(usageReport.comparative_load.mean)]] arrow"><iron-icon icon\$="[[percentageSignToArrow(usageReport.comparative_load.mean)]]" title\$="[[_formatLargeNumber(usageReport.comparative_load.mean)]]% change"></iron-icon></span>
                        </span>
                    </div>

                    <div class="infotext inline">
                        <span hidden\$="[[isNull(usageReport.cores.max)]]">
                            Cores max:  [[_formatLargeNumber(usageReport.cores.max)]]
                            <span class\$="[[percentageSignToText(usageReport.comparative_cores.max)]] arrow" hidden\$="[[isNull(usageReport.comparative_cores.max)]]"><iron-icon icon\$="[[percentageSignToArrow(usageReport.comparative_cores.max)]]" title\$="[[_formatLargeNumber(usageReport.comparative_cores.max)]]% change"></iron-icon></span>,
                        </span>

                        <span hidden\$="[[isNull(usageReport.cores.min)]]">
                            min: [[_formatLargeNumber(usageReport.cores.min)]]
                            <span class\$="[[percentageSignToText(usageReport.comparative_cores.min)]] arrow" hidden\$="[[isNull(usageReport.comparative_cores.min)]]"><iron-icon icon\$="[[percentageSignToArrow(usageReport.comparative_cores.min)]]" title\$="[[_formatLargeNumber(usageReport.comparative_cores.min)]]% change"></iron-icon></span>,
                        </span>

                        <span hidden\$="[[isNull(usageReport.cores.mean)]]">
                            avg: [[_formatLargeNumber(usageReport.cores.mean)]]
                            <span class\$="[[percentageSignToText(usageReport.comparative_cores.mean)]] arrow" hidden\$="[[isNull(usageReport.comparative_cores.mean)]]"><iron-icon icon\$="[[percentageSignToArrow(usageReport.comparative_cores.mean)]]" title\$="[[_formatLargeNumber(usageReport.comparative_cores.mean)]]% change"></iron-icon></span>
                        </span>
                    </div>

                </div>
                <div class="layout horizontal wrap">
                    <div class="graphArea flex-1">
                        <div class="no-data" hidden\$="[[!isEmpty(usageReport.history)]]">No usage data available</div>
                        <div id="usageGraph" class="graph" style\$="width: [[usageWidth]]px;"></div>
                    </div>
                    <div class="flex-1">
                        <div id="usageListByCloud" class="flex" hidden\$="{{!usageListByCloud}}">
                            <div class="smaller">Load by Cloud</div>
                            <div class="list">
                                <template is="dom-repeat" items="{{usageListByCloud}}">
                                    <div class="layout horizontal">
                                        <span class="index">[[_index(index)]]. </span>
                                        <span class="flexchild name-col flex-2">
                                            [[item.name]]
                                        </span>
                                        <div class="machines-column">
                                            [[item.machine_count.unique]] machines
                                        </div>
                                        <div class="machines-column">
                                            [[item.cores.mean]] cores
                                        </div>
                                        <span class="cost-column">
                                            [[item.load.mean]] load
                                        </span>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div id="usageListByStack" class="flex" hidden\$="{{!usageListByStack}}">
                            <div class="smaller">Load by [[stackTerm]]</div>
                            <div class="list">
                                <template is="dom-repeat" items="{{usageListByStack}}">
                                    <div class="layout horizontal">
                                        <span class="index">[[_index(index)]]. </span>
                                        <span class="flexchild name-col flex-2">
                                            [[item.name]]
                                            <span hidden\$="[[item.name.length]]">
                                                not in a [[stackTerm]]
                                            </span>
                                        </span>
                                        <div class="machines-column">
                                            [[item.machine_count.unique]] machines
                                        </div>
                                        <div class="machines-column">
                                            [[item.cores.mean]] cores
                                        </div>
                                        <span class="cost-column">
                                            [[item.load.mean]] load
                                        </span>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div id="usageListByTag" class="flex" hidden\$="{{!usageListByTag}}">
                            <div class="smaller">Load by Tag</div>
                            <div class="list">
                                <template is="dom-repeat" items="{{usageListByTag}}">
                                    <div class="layout horizontal">
                                        <span class="index">[[_index(index)]]. </span>
                                        <span class="flexchild name-col flex-2 tags">
                                            <span hidden\$="[[!item.name.length]]" class\$="tag hidden-[[!item.name.length]]">[[item.name]]</span>
                                        <span hidden\$="[[item.name.length]]">
                                                untagged
                                            </span>
                                        </span>
                                        <div class="machines-column">
                                            [[item.machine_count.unique]] machines
                                        </div>
                                        <div class="machines-column">
                                            [[item.cores.mean]] cores
                                        </div>
                                        <span class="cost-column">
                                            [[item.load.mean]] load
                                        </span>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </paper-material>
        <paper-material id="machines_overview">
            <div class="loading-data" hidden\$="{{!loadingDataCost}}"></div>
            <div class="head">
                <div class="flexchild">
                    <h2 class="title">Machines Overview</h2>
                    <div class="filterby highlight" hidden\$="[[!filterby.type.length]]">
                        <span class="uppercase">for [[_display(filterby.type)]]:</span><span class="uppercase [[filterby.type]]"> [[filterby.name]] <span hidden\$="[[filterby.id.length]]">select [[_display(filterby.type)]]</span>
                    </span></div>
                    <div class="filterby highlight" hidden\$="[[filterby.type.length]]">All infrastructure</div>
                </div>
                <div class="current-value">
                    <div class="subtitle smaller">Maximum</div>
                    <h2 class="cost">[[costReport.machine_count.max]]</h2>
                </div>
                <div class="current-value">
                    <div class="subtitle smaller">Average</div>
                    <h2 class="cost">[[costReport.machine_count.mean]]</h2>
                </div>
                <div class="current-value">
                    <div class="subtitle smaller">Unique</div>
                    <h2 class="cost">[[costReport.machine_count.unique]]</h2>
                </div>
            </div>
        </paper-material>
        <paper-material id="machinesCount" class="margin-bottom section">
            <div class="loading-data" hidden\$="{{!loadingDataCost}}">
                <paper-spinner active="{{loadingDataCost}}"></paper-spinner>
            </div>
            <div>
                <div class="comparative flexchild" hidden\$="[[isEmpty(costReport.history)]]">
                    <div class="infotext inline">
                        <strong>[[_formatLargeInteger(costReport.machine_count.unique)]]</strong> unique machines [[timeToText(pastItems,timeParams.past)]]
                    </div>
                    <div class="infotext inline" hidden\$="[[!costReport.comparative_machine_count.unique]]">
                        <span class\$="[[percentageSignToText(costReport.comparative_machine_count.unique)]]">
                            <span hidden\$="[[!costReport.comparative_machine_count.unique]]">[[abs(costReport.comparative_machine_count.unique)]]%</span>
                            [[percentageSignToText(costReport.comparative_machine_count.unique)]]
                        </span>
                        previous [[timeParams.window]]
                    </div>
                    <div class="infotext inline">
                        <span hidden\$="[[isNull(costReport.machine_count.max)]]">
                            Machines max: [[_formatLargeInteger(costReport.machine_count.max)]]
                            <span class\$="[[percentageSignToText(costReport.comparative_machine_count.max)]] arrow" hidden\$="[[isNull(costReport.comparative_machine_count.max)]]"><iron-icon icon\$="[[percentageSignToArrow(costReport.comparative_machine_count.max)]]" title\$="[[_formatLargeNumber(costReport.comparative_machine_count.max)]]% change"></iron-icon></span>,
                        </span>

                        <span hidden\$="[[isNull(costReport.machine_count.min)]]">
                            min: [[_formatLargeInteger(costReport.machine_count.min)]]
                            <span class\$="[[percentageSignToText(costReport.comparative_machine_count.min)]] arrow" hidden\$="[[isNull(costReport.comparative_machine_count.min)]]"><iron-icon icon\$="[[percentageSignToArrow(costReport.comparative_machine_count.min)]]" title\$="[[_formatLargeNumber(costReport.comparative_machine_count.min)]]% change"></iron-icon></span>,
                        </span>

                        <span hidden\$="[[isNull(costReport.machine_count.mean)]]">
                            avg: [[_formatLargeNumber(costReport.machine_count.mean)]]
                            <span class\$="[[percentageSignToText(costReport.comparative_machine_count.mean)]] arrow" hidden\$="[[isNull(costReport.comparative_machine_count.mean)]]"><iron-icon icon\$="[[percentageSignToArrow(costReport.comparative_machine_count.mean)]]" title\$="[[_formatLargeNumber(costReport.comparative_machine_count.mean)]]% change"></iron-icon></span>,
                        </span>

                        <span hidden\$="[[isNull(costReport.machine_count.unique)]]">
                            unique: [[_formatLargeInteger(costReport.machine_count.unique)]]
                            <span class\$="[[percentageSignToText(costReport.comparative_machine_count.unique)]] arrow" hidden\$="[[isNull(costReport.comparative_machine_count.unique)]]"><iron-icon icon\$="[[percentageSignToArrow(costReport.comparative_machine_count.unique)]]" title\$="[[_formatLargeNumber(costReport.comparative_machine_count.unique)]]% change"></iron-icon></span>
                        </span>
                    </div>
                </div>
                <div class="layout horizontal wrap">
                    <div class="graphArea flex-1">
                        <div class="no-data" hidden\$="[[!isEmpty(costReport.history)]]">No machines data available</div>
                        <div id="machinesGraph" class="graph" style\$="width: [[machinesWidth]]px;"></div>
                    </div>
                    <div class="flex-1">
                        <div id="machinesListByCloud" class="flex" hidden\$="{{!machinesListByCloud}}">
                            <div class="smaller">Machines by Cloud</div>
                            <div class="list">
                                <template is="dom-repeat" items="{{machinesListByCloud}}">
                                    <div class="layout horizontal">
                                        <span class="index">[[_index(index)]]. </span>
                                        <span class="flexchild name-col flex-2">
                                            [[item.name]]
                                        </span>
                                        <div class="machines-column flex-1" title="machines">
                                            [[item.machine_count.unique]] machines
                                        </div>
                                        <span class="cost-column">
                                            [[currency.sign]][[_convertCurrency(item.cost,currency.rate,2)]]
                                        </span>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div id="machinesListByStack" class="flex" hidden\$="{{!machinesListByStack}}">
                            <div class="smaller">Machines by [[stackTerm]]</div>
                            <div class="list">
                                <template is="dom-repeat" items="{{machinesListByStack}}">
                                    <div class="layout horizontal">
                                        <span class="index">[[_index(index)]]. </span>
                                        <span class="flexchild name-col flex-2">
                                            [[item.name]]
                                            <span hidden\$="[[item.name.length]]">
                                                not in a [[stackTerm]]
                                            </span>
                                        </span>
                                        <div class="machines-column flex-1" title="machines">
                                            [[item.machine_count.unique]] machines
                                        </div>
                                        <span class="cost-column">
                                            [[currency.sign]][[_convertCurrency(item.cost,currency.rate,2)]]
                                        </span>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div id="machinesListByTag" class="flex" hidden\$="{{!machinesListByTag}}">
                            <div class="smaller">Machines by Tag</div>
                            <div class="list">
                                <template is="dom-repeat" items="{{machinesListByTag}}">
                                    <div class="layout horizontal">
                                        <span class="index">[[_index(index)]]. </span>
                                        <span class="flexchild name-col flex-2">
                                            <span hidden\$="[[!item.name.length]]" class\$="tag hidden-[[!item.name.length]]">[[item.name]]</span>
                                        <span hidden\$="[[item.name.length]]">
                                                untagged
                                            </span>
                                        </span>
                                        <div class="machines-column flex-1" title="machines">
                                            [[item.machine_count.unique]] machines
                                        </div>
                                        <span class="cost-column">
                                            [[currency.sign]][[_convertCurrency(item.cost,currency.rate,2)]]
                                        </span>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </paper-material>
        <iron-ajax id="cloudsAjax" method="GET" url\$="[[uri]]/api/v1/clouds" headers\$="{&quot;[[authHeader]]&quot;: &quot;[[token]]&quot;}" handle-as="json" loading="{{loading}}" on-response="handleResponseClouds" on-error="handleError"></iron-ajax>
        <iron-ajax id="stacksAjax" method="GET" url\$="[[uri]]/api/v1/stacks" headers\$="{&quot;[[authHeader]]&quot;: &quot;[[token]]&quot;}" handle-as="json" loading="{{loading}}" on-response="handleResponseStacks" on-error="handleError"></iron-ajax>
        <iron-ajax id="costReportAjax" method="GET" url\$="[[uri]]/api/v1/report" headers\$="{&quot;[[authHeader]]&quot;: &quot;[[token]]&quot;}" handle-as="json" loading="{{loadingDataCost}}" on-response="handleResponseCostReport" on-error="handleError" params="[[params]]"></iron-ajax>
        <iron-ajax id="usageReportAjax" method="GET" url="[[uri]]/api/v1/report?type=load" headers\$="{&quot;[[authHeader]]&quot;: &quot;[[token]]&quot;}" handle-as="json" loading="{{loadingDataUsage}}" on-response="handleResponseUsageReport" on-error="handleError" params="[[params]]"></iron-ajax>
`,

  is: 'mist-insights',

  properties: {
      behaviors: [
        IronResizableBehavior
      ],
      model: {
          type: Object,
          value: function() {
              return {};
          }
      },
      noshadow: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
      },
      authHeader: {
          type: String,
          value: 'Authorization'
      },
      tenant: {
          type: String
      },
      token: {
          type: String,
          value: '',
      },
      uri: {
          type: String,
          value: 'https://mist.io'
      },
      largescreen: {
          type: Boolean,
          reflectToAttribute: true
      },
      params: {
          type: Object
      },
      timeParams: {
          type: Object,
          value: function(){
              return {
                  window: null,
                  past: '0'
              }
          }
      },
      filterby: {
          type: Object,
          value: function() {
              return {
                  type: '',
                  name: '',
                  id: ''
              };
          }
      },
      clouds: Array,
      stacks: Array,
      tags: Array,
      costReport: Object,
      usageReport: Object,
      costGraph: Object,
      costGraphOptions: {
          type: Object,
          value: function() {
              return COST_GRAPH_OPTIONS;
          }
      },
      drillcostgraph: Object,
      drillcostgraphOptions: {
          type: Object,
          value: function() {
              return DRILL_COST_GRAPH_OPTIONS;
          }
      },
      costListByCloud: Array,
      costListByStack: Array,
      costListByTag: Array,
      usageListByCloud: Array,
      usageListByStack: Array,
      usageListByTag: Array,
      usageGraph: Object,
      usageGraphOptions: {
          type: Object,
          value: function() {
              return USAGE_GRAPH_OPTIONS;
          }
      },
      machinesListByCloud: {
          type: Array,
          computed: 'sortByMachineCount(costListByCloud)'
      },
      machinesListByStack: {
          type: Array,
          computed: 'sortByMachineCount(costListByStack)'
      },
      machinesListByTag: {
          type: Array,
          computed: 'sortByMachineCount(costListByTag)'
      },
      machinesGraph: Object,
      machinesGraphOptions: {
          type: Object,
          value: function() {
              return MACHINES_GRAPH_OPTIONS;
          }
      },
      pastItems: Array,
      period: String,
      costWidth: Number,
      drillCostWidth: Number,
      usageWidth: Number,
      machinesWidth: Number,
      cloud: String,
      stack: String,
      tag: String,
      stackName: {
          type: String,
          reflectToAttribute: true
      },
      allowFilter: {
          type: Boolean,
          computed: '_computeAllowFilter(cloud, stack, tag)',
          value: true
      },
      showClear: {
          type: Boolean,
          computed: '_computeShowClear(allowFilter, filterby.*)',
          value: true
      },
      stackTerm: {
          type: String,
          value: 'stack'
      },
      retryCount: {
          type: Number,
          value: 0
      },
      currency: {
          type: Object
      }
  },

  listeners: {
      'iron-resize': 'updateChartWidth'
  },

  observers: [
      '_computePastItems(timeParams.*)',
      '_updateCostData(costReport.history, currency)',
      '_updateUsageData(usageReport.history)',
      '_computeFilterbyItems(filterby.*)',
      '_updateCombinedParams(timeParams.*, filterby.*)',
      '_updateCostDrillData(costReport.group_by, filterby.id, currency)',
      '_updateTenant(tenant)',
      '_updateFilterByStackName(stackName)'
  ],

  ready: function() {},

  attached: function() {
      this.initCharts();

      if (!this.token)
          this.uri = '';

      if (this.period)
          this.set('timeParams.window', this.period);
      else
          this.set('timeParams.window', 'month');

      if (this.cloud || this.stack || this.stackName || this.tag) {
          if (this.cloud){
              this.set('filterby.type', 'cloud');
              this.set('filterby.id', this.cloud);
          } else if (this.stack) {
              this.set('filterby.type', 'stack');
              this.set('filterby.id', this.stack);
          } else if (this.stackName){
              this.$.stacksAjax.generateRequest();
          } else if (this.tag) {
              this.set('filterby.type', 'tag');
              this.set('filterby.id', this.tag);
          }
      }
  },

  _computeAllowFilter: function(cloud, stack, tag){
      this.set('allowFilter', cloud || stack || tag ? false : true);
  },

  _computeShowClear: function(allowFilter, idLength) {
      console.log('_computeShowClear', this.allowFilter, this.filterby.id.length );
      return this.filterby.id.length > 0 && this.allowFilter;
  },

  initCharts: function() {
      const colorPalette = ['#607D8B', '#d96557', '#3F51B5', '#009688', '#795548', '#8c76d1', '#795548', '#0277BD', '#0099cc', '#424242', '#D48900', '#43A047', '#2F2F3E'];
      echarts.registerTheme('insights', {
          color: colorPalette,
          backgroundColor: 'transparent',
          graph: {
              color: colorPalette
          }
      });
      this.costGraph = echarts.init(this.$.costGraph, 'insights');
      this.machinesGraph = echarts.init(this.$.machinesGraph, 'insights');
      this.usageGraph = echarts.init(this.$.usageGraph, 'insights');
      this.drillcostgraph = echarts.init(this.$.drillcostgraph);
      this.updateChartWidth();
      console.log('initialized charts');
  },

  isNull: function(value) {
      return value == null;
  },

  isEmpty: function(array) {
      return array.length == 0 ? true : false;
  },

  abs: function(perc) {
      const inp = Math.abs(perc);
      return this._formatLargeNumber(inp);
  },

  _display: function(type) {
      if (type == 'cloud' || type == 'tag')
          return type;
      else
          return this.stackTerm || 'stack';
  },

  percentageSignToText: function (perc) {
      if (perc == null)
          return ''
      else if (perc == 0)
          return 'equal to'
      else
          return perc > 0 ? 'above' : 'below'
  },

  percentageSignToArrow: function (perc) {
      if (perc == null)
          return ''
      else if (perc == 0)
          return 'icons:remove'
      else
          return perc > 0 ? 'icons:arrow-upward' : 'icons:arrow-downward'
  },

  _updateCostData: function (history, currency) {
      let costData = [];
      let machinesData = [];

      if (history) {
          if (history[0])
              this.setXAxisMinMax(history[0].date,history[history.length-1].date);
          else
              this.setXAxisMinMax();
          console.log('history[0]',history[0]);
          costData = history.map(function(datapoint) {
              return [moment.utc(datapoint.date).toDate(), datapoint.cost_per_month];
          });
          machinesData = history.map(function(datapoint) {
              return [moment.utc(datapoint.date).toDate(), datapoint.machine_count];
          });
      }
      
      this.set('costGraphOptions.series.0.data', this._ratedCosts(costData, this.currency.rate));
      if (this.costGraph)
          this.costGraph.setOption(this.costGraphOptions);

      this.set('machinesGraphOptions.series.0.data', machinesData);
      if (this.machinesGraph)
          this.machinesGraph.setOption(this.machinesGraphOptions);
  },

  _updateUsageData(history) {
      let usageData = [];
      let coresData = [];
      let usageListByCloud;
      let usageListByStack;
      let usageListByTag;

      if (history) {
          if (history[0])
              this.setXAxisMinMax(history[0].date,history[history.length-1].date);
          else
              this.setXAxisMinMax();
          usageData = history.map(function(datapoint) {
              return [moment.utc(datapoint.date).toDate(), datapoint.load];
          });
          coresData = history.map(function(datapoint) {
              return [moment.utc(datapoint.date).toDate(), datapoint.cores];
          });
      }

      this.set('usageGraphOptions.series.0.data', coresData);
      this.set('usageGraphOptions.series.1.data', usageData);
      if (this.usageGraph)
          this.usageGraph.setOption(this.usageGraphOptions);

      if (this.usageReport.group_by['cloud'])
          usageListByCloud = this.usageReport.group_by['cloud'].sort(function(a, b) {
              return a.load.mean < b.load.mean
          });
      if (this.usageReport.group_by['stack'])
          usageListByStack = this.usageReport.group_by['stack'].sort(function(a, b) {
              return a.load.mean < b.load.mean
          });
      if (this.usageReport.group_by['tag'])
          usageListByTag = this.usageReport.group_by['tag'].sort(function(a, b) {
              return a.load.mean < b.load.mean
          });

      // fill in cost lists
      this.set('usageListByCloud', usageListByCloud || false);
      this.set('usageListByStack', usageListByStack || false);
      this.set('usageListByTag', usageListByTag || false);

      console.log('updated usage data');
  },

  _updateCostDrillData (groupby, filterbyname, currency) {
      let costRingData = [];
      let costRingLabels = [];
      let costListByCloud;
      let costListByStack;
      let costListByTag;

      if (this.costReport && this.costReport.group_by) {
          costRingData = this.costReport.group_by['cloud'] && this.costReport.group_by['cloud'].map(function(point) {
              return {
                  value: point.cost,
                  name: point.name
              };
          }, this);
          costRingLabels = this.costReport.group_by['cloud'] && this.costReport.group_by['cloud'].map(function(point) {
              return point.name;
          }, this);

          if (this.costReport.group_by['cloud']) {
              costListByCloud = this.sortByCost(this.costReport.group_by['cloud']);
          }
          if (this.costReport.group_by['stack']) {
              costListByStack = this.sortByCost(this.costReport.group_by['stack']);
          }
          if (this.costReport.group_by['tag']) {
              costListByTag = this.sortByCost(this.costReport.group_by['tag']);
          }
      }

      // fill in ring
      this.set('drillcostgraphOptions.series.0.data', this._ratedCosts(costRingData, this.currency && this.currency.rate || 1));
      this.set('drillcostgraphOptions.legend.data', costRingLabels);
      console.log('this.drillcostgraphOptions', this.drillcostgraphOptions);
      if (this.drillcostgraph && this.drillcostgraphOptions)
          this.drillcostgraph.setOption(this.drillcostgraphOptions);

      // fill in cost lists
      this.set('costListByCloud', costListByCloud || false);
      this.set('costListByStack', costListByStack || false);
      this.set('costListByTag', costListByTag || false);

  },

  _ratedCosts(arrayCosts, rate) {
      rate = rate || 1;
      const ratedArray = [];
      if (arrayCosts && arrayCosts.length) {
          for (let i = 0; i < arrayCosts.length; i++) {
              if (arrayCosts[i].length) {
                  arrayCosts[i][1] = this._ratedCost(arrayCosts[i][1],rate);
              } else if (arrayCosts[i].value != undefined) {
                  arrayCosts[i].value = this._ratedCost(arrayCosts[i].value,rate);
              }
              ratedArray.push(arrayCosts[i]);
          }
      }
      return ratedArray;
  },

  _ratedCost: function(cost, rate) {
      return cost * (rate || 1);
  },

  sortByMachineCount: function (array) {
      if (array) {
          const ret = array.slice(0);
          return ret.sort((a, b) => {
              return a.machine_count.unique < b.machine_count.unique
          })
      }
      return false;
  },

  sortByCost: function(array) {
      if (array) {
          const ret = array.slice(0);
          return ret.sort(function(a, b) {
              return a.cost < b.cost
          })
      }
      return false;
  },

  _computePastItems: function (timeParamsChangeRecord) {
      // console.log("loadingData", this.loadingData);
      let items = [];
      if (this.timeParams.window == "hour") {
          items.push({
              value: 0,
              text: "this hour"
          });
          items.push({
              value: 1,
              text: "last hour"
          });
          for (let i = 2; i < 11; i++) {
              items.push({
                  value: i,
                  text: i + " hours ago"
              });
          }
      } else if (this.timeParams.window == "day") {
          items.push({
              value: 0,
              text: "today"
          });
          items.push({
              value: 1,
              text: "yesterday"
          });
          for (let i = 2; i < 11; i++) {
              items.push({
                  value: i,
                  text: i + " days ago"
              });
          }
      } else if (this.timeParams.window == "week") {
          items = [{
              value: '0',
              text: 'this week'
          }, {
              value: '1',
              text: 'last week'
          }, {
              value: '2',
              text: 'two weeks ago'
          }, {
              value: '3',
              text: 'three weeks ago'
          }]
      } else if (this.timeParams.window == "month") {
          for (let i = 0; i < 12; i++) {
              let t = '';
              if (i == 0)
                  t = 'this month';
              else if (i == 1)
                  t = 'last month';
              else
                  t = i + ' months ago';

              items.push({
                  value: i,
                  text: t
              })
          }
      } else if (this.timeParams.window == "quarter") {
          items = [{
              value: '0',
              text: 'current quarter'
          }, {
              value: '1',
              text: 'previous quarter'
          }, {
              value: '2',
              text: '2 quarters ago'
          }, {
              value: '3',
              text: '3 quarters ago'
          }]
      }

      this.set('pastItems', items);

      // if window changed reset selected past
      if (timeParamsChangeRecord.path == 'timeParams.window') {
          this.set('timeParams.past', '0');
          this.async(function() {
              this.$.past.selected = -1;
              this.$.past.selected = 0;
          }, 100, this)
      }
  },

  timeToText: function(items, past){
      const ps = items || [];
      const timePeriod = ps.find((i) => {
          return i.value == past;
      });
      if (timePeriod)
          return timePeriod.text;
  },

  updateFilterItems(_group_by) {
      let clouds = [];
      let stacks = [];
      let tags = [];
      if (this.token) {
          clouds = this.costReport.group_by.cloud || [];
          stacks = this.costReport.group_by.stack || [];
          tags = this.costReport.group_by.tag || [];
      } else if (this.model) {
          clouds = this.model.cloudsArray;
          stacks = this.model.stacksArray;
          tags = [];
          const taggedMachines = this.model.machinesArray && this.model.machinesArray.filter(function(m) {
              return m.tags.length > 0
          });
          if (taggedMachines) 
              taggedMachines.forEach(function(m) {
                  for (let i = 0; i < m.tags.length; i++) {
                      let postfix = '';
                      if (m.tags[i].value != '') {
                          postfix = '=' + m.tags[i].value;
                      }
                      tags.push({
                          'name': m.tags[i].key + postfix,
                          'id': m.tags[i].key + postfix,
                          'val': m.tags[i].val
                      });
                  }
              });
          const names = tags.map(function(t) {
              return t.name;
          });
          tags = tags.filter(function(t, ind) {
              return names.indexOf(t.name) == ind;
          });
      }

      this.set('clouds', clouds);
      this.set('stacks', stacks.filter(function(c) {
          return c.name != ""
      }));
      this.set('tags', tags.filter(function(c) {
          return c.name != ""
      }));

  },

  _computeFilterbyItems(filterby) {
      let items = [];
      if (filterby.path == 'filterby.type') {
          if (this.filterby.type == 'stack')
              items = this.stacks;
          else if (this.filterby.type == 'cloud')
              items = this.clouds;
          else if (this.filterby.type == 'tag')
              items = this.tags;
          else
              items = [];

          if (!items || !items.length) {
              this.set('filterbyDisable', true);
          } else {
              this.set('filterbyDisable', false);
          }

          this.set('filterbyItems', items);
      }

      // if filterby changed reset selected item
      // console.log(filterby.path);
      if (filterby.path == 'filterby.type') {
          this.set('filterby.name', '');
          this.async(function() {
              this.$.filterbyName.selected = '';
          }, 100, this)
      }
      // if filterby id changed update name
      if (filterby.path == 'filterby.id') {
          this.set('filterby.name', this.computeName(filterby.value));
      }

      // if filterby set when stackname
      if (filterby.path == 'filterby'){
          if (this.stackName)
              this.set('filterbyItems', this.stacks);
      }

  },

  _updateCombinedParams: function (time, filter) {
      // console.log('filter path', filter.path, this.timeParams.past);

      // dont update params so dont request, if user changes window, type, name or has not specified filter by id
      // also dont request for past = -1

      if (filter.path == 'filterby.type' || filter.path == 'filterby.name' || time.path == 'timeParams.window' || (filter.path == 'filterby.id' && filter.value == "") || time.value == "-1") {
          // console.log('dont send ', this.params);
      }
      else if ((filter.path == 'filterby.id' || filter.path == 'filterby') && this.timeParams.window){
          const p = {
              window: this.timeParams.window,
              past: this.timeParams.past
          };

          if (this.filterby.type != '' && this.filterby.id != '') {
              p[this.filterby.type] = this.filterby.id;
          }

          this.set('params', p);

          if (this.$.costReportAjax){
              this.debounce('costReportRequest', function() {
                  this.$.costReportAjax.generateRequest()
              }, 100);
          }
      }
  },

  setXAxisMinMax: function(datamin, datamax){
      const timewindow = this.timeParams.window;
      const timepast = this.timeParams.past;
      const reference = moment.utc();
      if (timewindow == 'hour'){
          if (timepast)
              reference.subtract(timepast, 'h')
      } else if (timewindow == 'day'){
          if (timepast)
              reference.subtract(timepast, 'd')
      } else if (timewindow == 'week'){
          if (timepast)
              reference.subtract(timepast, 'w');
      } else if (timewindow == 'month'){
          if (timepast)
              reference.subtract(timepast, 'M')
      } else if (timewindow == 'quarter'){
          if (timepast)
              reference.subtract(timepast, 'Q')
      }

      const start = reference.startOf(timewindow.replace("week", "isoWeek")), end = moment(start).endOf(timewindow.replace("week", "isoWeek"));
      if (datamax && datamin){
          this.setXAxisMax(moment.max(end, moment.utc(datamax)).toDate());
          this.setXAxisMin(moment.min(start, moment.utc(datamin)).toDate());
      } else {
          this.setXAxisMax(end.toDate());
          this.setXAxisMin(start.toDate());
      }
  },

  setXAxisMin: function(min){
      this.set('costGraphOptions.xAxis.0.min', min);
      this.set('usageGraphOptions.xAxis.0.min', min);
      this.set('machinesGraphOptions.xAxis.0.min', min);
  },

  setXAxisMax: function(max){
      this.set('costGraphOptions.xAxis.0.max', max);
      this.set('usageGraphOptions.xAxis.0.max', max);
      this.set('machinesGraphOptions.xAxis.0.max', max);
  },

  computeName: function(id) {
      if (id) {
          if (this.filterby.type == 'tag') {
              return id;
          } else if (this.filterby.type == 'cloud') {
              if (!this.token)
                  return this.model.clouds[id].name;
              else
                  return this.clouds && this.clouds.find(function(c) {
                      return c.id == id;
                  }).name;
          } else if (this.filterby.type == 'stack') {
              if (!this.token)
                  return this.model.stacks[id].name;
              else (!this.stackName)
                  return this.stacks && this.stacks.find(function (s) {
                      return s.id == id;
                  }).name;
          }
      } else {
          return '';
      }
  },

  clearFilter: function(e) {
      this.set('filterby', {
          type: '',
          name: '',
          id: ''
      });
  },

  updateChartWidth: function() {
      console.log('updateChartWidth');
      const parentWidth = this.$.graphRow.offsetWidth - 50;

      if (parentWidth / 2 > 400) {
          this.set('costWidth', parentWidth / 2);
          this.set('usageWidth', parentWidth / 2);
          this.set('machinesWidth', parentWidth / 2);
          if (parentWidth / 4 > 300)
              this.set('drillCostWidth', parentWidth / 4);
          else
              this.set('drillCostWidth', parentWidth / 2);
      } else {
          this.set('costWidth', parentWidth);
          this.set('drillCostWidth', parentWidth);
          this.set('usageWidth', parentWidth);
          this.set('machinesWidth', parentWidth);
      }

      this.resizeGraphs();
  },

  resizeGraphs: function() {
      console.log('resizeGraphs');
      if (this.costGraph)
          this.costGraph.resize();
      if (this.drillcostgraph)
          this.drillcostgraph.resize();
      if (this.usageGraph)
          this.usageGraph.resize();
      if (this.machinesGraph)
          this.machinesGraph.resize();
  },

  _index: function(ind) {
      return ind + 1;
  },

  _formatLargeNumber: function(inp,decimals,type) {
      // console.log('inp', typeof(inp), inp);
      decimals = decimals || 0;
      if (inp != undefined && inp != NaN) {
          return inp.formatLargeNumber(decimals);
      } else {
          return '';
      }
  },

  _convertCurrency(cost,rate,decimals) {
      rate = rate || 1;
      const converted = cost * rate;
      decimals = decimals || 2;
      if (converted != undefined && !Number.isNaN(converted))
        return converted.formatLargeNumber(decimals);
  },

  _formatLargeInteger: function(inp) {
      // console.log('inp', typeof(inp), inp);
      if (inp != undefined && inp != NaN)
          return inp.formatLargeNumber(0);
      else
          return '';
  },

  handleResponseClouds: function(e) {
      console.log('handleResponseClouds');
      this.set('clouds', e.detail.xhr.response);
  },

  handleResponseStacks: function(e) {
      console.log('handleResponseStacks');
      this.set('stacks', e.detail.xhr.response);
  },

  handleResponseCostReport: function(e) {
      console.log('handleResponseCostReport');
      if (typeof echarts == 'undefined' && this.retryCount < 20) {
          this.async(function(){
              this.handleResponseCostReport(e);
              this.retryCount += 1
          }, 100);
          return;
      }
      if (e.detail.xhr.response && e.detail.xhr.response.history && e.detail.xhr.response.history.length){
          this.set('costReport', e.detail.xhr.response);
          this.$.usageReportAjax.generateRequest();
      } else {
          this.clearData();
      }

      if (this.filterby.type == '') {
          this.updateFilterItems(this.costReport.group_by);
      }

      this.resizeGraphs();

  },

  handleResponseUsageReport: function(e) {
      console.log('handleResponseUsageReport');
      if (e.detail.xhr.response && e.detail.xhr.response.history && e.detail.xhr.response.history.length) {
          this.set('usageReport', e.detail.xhr.response);
      } else {
          this.clearData('usage');
      }

      this.resizeGraphs();
  },

  handleError: function(e) {
      console.log('handleError');
      this.clearData();
  },

  clearData: function(usage){
      const emptyCost = {
          cost: undefined,
          history: [],
          group_by: {stack: [], cloud: [], tag: []},
          comparative_cost: {max: undefined, unique: undefined, min: undefined, mean: undefined},
          machine_count: {min: undefined, max: undefined, unique: undefined, miin: undefined},
          comparative_machine_count: {max: undefined, mean: undefined, min: undefined, unique: undefined},
          cost_per_month: {max: undefined, mean: undefined, min: undefined}
      }
      const emptyUsage = {
          load: {max: undefined, mean: undefined, min: undefined},
          comparative_load: {max: undefined, mean: undefined, min: undefined},
          history: [],
          group_by: {stack: [], cloud: [], tag: []},
          cores: {max: undefined, mean: undefined, min: undefined},
          comparative_cores: {max: undefined, mean: undefined, min: undefined},
          machine_count: {min: undefined, max: undefined, unique: undefined, miin: undefined}
      }

      if (!usage)
          this.set('costReport', emptyCost);
      this.set('usageReport', emptyUsage);
  },

  lastValue: function(history, val){
      return history.length > 1 ? this._formatLargeNumber(history[history.length-1][val],2,'cost') : '';
  },

  _updateTenant: function(tenant) {
      if (tenant.length && !this.uri.length) {
          this.$.costReportAjax.headers.tenant = tenant;
          this.$.usageReportAjax.headers.tenant = tenant;
      }
  },

  _updateFilterByStackName: function(stackName){
      if (this.stacks && stackName) {
          console.log('this.stacks && this.stackName', this.stacks && this.stackName)
          const name = this.stackName;
          const stack = this.stacks.find((s) => {
                  return s.name == name;
              });
          if (stack) {
              const fb = {
                  type: 'stack',
                  name: this.stackName,
                  id: stack.id
              }
              this.set('filterby', fb);
          }
          else {
              console.log("Can't find stack. clear filter.");
              this.clearFilter();
          }
      }

      if (!stackName || (stackName.path == "stackName" && !stackName.value)){
          this.clearFilter();
      }
  },

  _exportPdf(){
          let generatePdf = function() {

              // pdf variables and title
              var pdf = new jsPDF('p', 'mm', 'a4');
              //pdf.addFont('Roboto', 'Noto', 'normal');
              //pdf.setFont('Noto')
              let offset = 20;
              pdf.setFontSize(20);
              pdf.setFontStyle("bold");
              pdf.text("Insights Report", 105, offset-10, {align: "center"});

              // finding the time period and adding it below the title
              let timePeriod, toDate, fromDate; 
              if(this.costReport.history && this.costReport.history.length >= 1){
                  fromDate = new Date(this.costReport.history[0].date);
                  toDate = new Date(this.costReport.history.slice(-1)[0].date);
                  timePeriod = fromDate.toDateString().slice(4).replace(/\s/g,"-");
                  if(this.timeParams.window == "hour"){
                      timePeriod += " " + fromDate.getHours() + ":00 - " + toDate.getHours() + ":00"; 
                  } else if(this.timeParams.window == "quarter"){
                      var quarter = Math.ceil((fromDate.getMonth() + 1) / 3);
                      timePeriod = fromDate.getFullYear() + " Quarter " + quarter; 
                  } else if(this.timeParams.window == "month"){
                      timePeriod = fromDate.toDateString().slice(4,7) + "-" + fromDate.getFullYear();
                  } else if (this.timeParams.window == "week") {
                      timePeriod += " - " + toDate.toDateString().slice(4).replace(/\s/g,"-");
                  }
              } else {
                  // no data to show
                  return;
              }
              pdf.setFontSize(16);
              pdf.text(timePeriod, 105, offset-3, {align: "center"});

              // fetching the elements of the Cost Overview div and adding them to the pdf
              var costOverview = this.shadowRoot.querySelector('#cost_overview').querySelector(".head");
              var head = costOverview.querySelector(".title");
              var filters = costOverview.querySelectorAll(".filterby.highlight");
              let infrastuctureType = "";
               // checking which one is not hidden
              for(let filter of filters){
                  if(!filter.hidden){
                      infrastructureType = filter;
                      break;
                  }
              }
              pdf.fromHTML(head.outerHTML, 10, offset);
              pdf.fromHTML(infrastructureType.innerText,12, offset+15);

              // fetching the total cost for the time period from the right side of the cost overview
              var costOverviewRightPart = costOverview.querySelector(".current-value");
              var costToShow = "Cost: " + costOverviewRightPart.innerText.split('\n')[1];
              pdf.setTextColor(30);
              pdf.setFontSize(14);
              pdf.setFontStyle('normal');
              pdf.text(costToShow, 170, offset+15);

              // adding a separator line on the pdf to resemble the UI
              pdf.setTextColor(150);
              let txt = "_".repeat(210);
              pdf.text(txt, 0, offset+25);
              
              // this is the element that contains all the graphs
              var graphs = this.shadowRoot.querySelector('#graphRow');

              // getting the comprehensive cost information above the graphs and placing them
              var costData = graphs.querySelector(".comparative").innerText.toLowerCase().split('run rate');
              costData[0] += "Run Rate"
              pdf.setTextColor(100);
              pdf.setFontStyle(12);
              offset += 35
              for (let data of costData){
                  pdf.text(data.trim(), 3, offset);
                  offset += 8;

              }

              // adding the first graph
              var firstGraph = graphs.querySelector("#costGraph").childNodes[0].childNodes[0];
              pdf.setFontSize(10);
              pdf.setTextColor(128);
              pdf.text("Run Rate ($/month)",10, 73);
              pdf.addImage(firstGraph.toDataURL('image/png'), 'PNG', 10, 75);

              // adding the second graph
              var secondGraph = graphs.querySelector('#drillcostgraph').childNodes[0].childNodes[0];
              pdf.text("Cost by Cloud", 10, 175);                    
              pdf.addImage(secondGraph.toDataURL('image/png'), 'PNG', 10, 180);

              // new page and reset the offset
              pdf.addPage();
              offset = 10;

              // fetching the by cloud cost list and placing the entries in the pdf
              var sortedByCloudList = graphs.querySelector('#costListByCloud').querySelector(".list").querySelectorAll('.layout.horizontal')
              pdf.setFontSize(14);
              pdf.text("Cost by Cloud", 10, offset);
              offset += 7;
              pdf.setFontSize(12);
              pdf.setTextColor(0);
              for(let i=0; i<sortedByCloudList.length; i++){
                  let txts = sortedByCloudList[i].innerText.split('\n');
                  txt = (i+1) + ". " + txts[1];
                  pdf.text(txt, 10, offset);
                  pdf.text(txts[2], 50, offset);
                  pdf.text(txts[3], 90, offset);
                  offset += 8;
              }

              // fetching the by tag cost list and if there are entries placing them in the pdf
              var sortedByTagList = graphs.querySelector('#costListByTag').querySelector(".list").querySelectorAll('.layout.horizontal');
              if(sortedByTagList.length >= 0){
                  offset += 8;
                  pdf.setTextColor(128);
                  pdf.setFontSize(14);
                  pdf.text("Cost by Tag", 10, offset);
                  offset += 8;
                  pdf.setTextColor(0);
                  pdf.setFontSize(12);
                  for(let i=0; i<sortedByTagList.length; i++){
                      let txts = sortedByTagList[i].innerText.split('\n');
                      txt = (i+1) + ". " + txts[1];
                      pdf.text(txt, 10, offset);
                      pdf.text(txts[2], 50, offset);
                      pdf.text(txts[3], 90, offset);
                      offset += 8;
                  }
              }

              // creating a name for the pdf file that contains the exact date
              var nameDate = new Date().toLocaleString().replace("/", "_").replace("/","_").replace(", ","_").replace(":","_").replace(" ", "_");
              var name = 'Costs-' + this.timeParams.window + "-" + nameDate + ".pdf";
              pdf.save(name);
          }.bind(this)
      try {
          new jsPDF();
          generatePdf();
      } catch (e) { // import jspdf if not loaded
          return this.dispatchEvent(
              new CustomEvent('import-script', {
                  bubbles: true, composed: true, detail: {
                      url: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js',
                      cb: generatePdf
                  }
              }));
      }
  }
});

Number.prototype.formatLargeNumber = function(c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
