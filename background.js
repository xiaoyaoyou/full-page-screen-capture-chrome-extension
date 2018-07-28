'use strict';

//var MetricReportItem = {
//  level: 1,
//  title: '',
//  url: '',
//
//  createNew: function(level, title, url) {
//    var obj = {};
//    obj.level = level;
//    obj.title = title;
//    obj.url = url;
//
//    return obj;
//  }
//};
//
//var defaultMetricReportCfg = [
//  MetricReportItem.createNew(1, '总结', ''),
//  MetricReportItem.createNew(1, '业务metrics', ''),
//  MetricReportItem.createNew(2, '微信', 'http://metrics-base.intra.yeshj.com/dashboard/db/xiao-xi-zhong-xin-ye-wu-shu-ju-wei-xin?from=1531670400000&orgId=11&refresh=60s&to=1532275199999'),
//  MetricReportItem.createNew(2, '短信', 'http://metrics-base.intra.yeshj.com/dashboard/db/xiao-xi-zhong-xin-ye-wu-shu-ju-duan-xin?orgId=11&from=1531670400000&to=1532275199999'),
//  MetricReportItem.createNew(2, '邮件', 'http://metrics-base.intra.yeshj.com/dashboard/db/xiao-xi-zhong-xin-ye-wu-shu-ju-you-jian?refresh=15m&orgId=11&from=1531670400000&to=1532275199999'),
//  MetricReportItem.createNew(1, '机器（应用、中间件、数据库）\n 机器负载 \n CPU 使用率 \n 内存使用率 \n 磁盘使用率 \n网络流量', ''),
//  MetricReportItem.createNew(2, '微信', 'http://10.10.50.100:3006/dashboard/db/xiao-xi-zhong-xin-wechat?orgId=1&from=1531670400000&to=1532275199999'),
//  MetricReportItem.createNew(2, '短信', 'http://10.10.50.100:3006/dashboard/db/xiao-xi-zhong-xin-duan-xin?orgId=1&from=1531670400000&to=1532275199999'),
//  MetricReportItem.createNew(2, '模版消息', 'http://10.10.50.100:3006/dashboard/db/xiao-xi-zhong-xin-mo-ban-xiao-xi?orgId=1&from=1531670400000&to=1532275199999'),
//  MetricReportItem.createNew(2, '应用推送', 'http://10.10.50.100:3006/dashboard/db/xiao-xi-zhong-xin-app_push?orgId=1&from=1531670400000&to=1532275199999'),
//  MetricReportItem.createNew(2, '邮件', 'http://10.10.50.100:3006/dashboard/db/xiao-xi-zhong-xin-you-jian?orgId=1&from=1531670400000&to=1532275199999'),
//  MetricReportItem.createNew(2, 'TTS', 'http://10.10.50.100:3006/dashboard/db/xiao-xi-zhong-xin-tts?orgId=1&from=1531670400000&to=1532275199999'),
//  MetricReportItem.createNew(2, '用户层通知中心', 'http://10.10.50.100:3006/dashboard/db/xiao-xi-zhong-xin-yong-hu-ceng-tong-zhi-zhong-xin?orgId=1&from=1531670400000&to=1532275199999'),
//  MetricReportItem.createNew(1, '网关（API Gateway）', ''),
//  MetricReportItem.createNew(2, '周期内站点访问量，状态码数量，超时数据', 'http://elk.yeshj.com/#dashboard/temp/AWTBkff2ADTX0K9c8kx2'),
//  MetricReportItem.createNew(2, 'API 调用日志 \n * n 天内每天总数据情况以及 error, warn, info 数据占比 \n * error 排行 top 7 \n * warn 排行 top 7 \n 7 天内每天总数据情况以及 error, warn, info 数据占比', 'http://elk.yeshj.com/#dashboard/temp/AWTBkymRADTX0K9c8k8k'),
//  MetricReportItem.createNew(2, 'error 排行 top 7', 'http://elk.yeshj.com/#dashboard/temp/AWTBk-jYADTX0K9c8lCu'),
//  MetricReportItem.createNew(1, 'Redis', 'http://metrics-base.intra.yeshj.com/dashboard/db/shuang-zhong-xin-redis?refresh=60s&orgId=1&from=now-7d&to=now&var-host=redis-message-base.intra.yeshj.com'),
//  MetricReportItem.createNew(1, 'MQ', ''),
//  MetricReportItem.createNew(2, '微信', 'http://metrics-base.intra.yeshj.com/dashboard/db/rabbitmq-notifycenter-queue?refresh=60s&orgId=1&from=1531670400000&to=1532275199999&var-host=All&var-vhost=All&var-queue=base.notify.wechat.applet.q&var-queue=base.notify.wechat.group.q&var-queue=base.notify.wechat.qq.q&var-queue=base.notify.wechat.v1.q&var-queue=base.notify.wechat.v2.q'),
//  MetricReportItem.createNew(2, '短信', 'http://metrics-base.intra.yeshj.com/dashboard/db/rabbitmq-notifycenter-queue?refresh=60s&orgId=1&var-host=All&var-vhost=All&var-queue=base.notify.sms.high.q&var-queue=base.notify.sms.low.q&var-queue=base.notify.sms.medium.q&from=1531670400000&to=1532275199999'),
//  MetricReportItem.createNew(2, '其它', 'http://metrics-base.intra.yeshj.com/dashboard/db/rabbitmq-notifycenter-queue?refresh=60s&orgId=1&from=1531670400000&to=1532275199999&var-host=All&var-vhost=All&var-queue=base.notify.push.delay.q&var-queue=base.notify.push.javaapp.q&var-queue=base.notify.push.javacc.q&var-queue=base.notify.push.javatemplate.q&var-queue=base.notify.push.msgcache.q&var-queue=base.postoffice.multi.msg.push.q&var-queue=mail.exchange.q&var-queue=mail.normal.q&var-queue=mail.postfix.q'),
//  MetricReportItem.createNew(1, 'JVM', ''),
//  MetricReportItem.createNew(2, '短信', 'http://metrics-base.intra.yeshj.com/dashboard/db/jvm-notifycenter-sms-job-v170911-1624?from=1531670400000&orgId=2&refresh=1m&to=1532275199999'),
//  MetricReportItem.createNew(2, '模版消息', 'http://metrics-base.intra.yeshj.com/dashboard/db/jvm-notifycenter-template-job-v170911-1624?refresh=1m&orgId=2&from=1531670400000&to=1532275199999'),
//  MetricReportItem.createNew(2, '应用推送', 'http://metrics-base.intra.yeshj.com/dashboard/db/jvm-notifycenter-apppush-v170911-1624?refresh=1m&orgId=2&from=1531670400000&to=1532275199999'),
//  MetricReportItem.createNew(2, '邮件', 'http://metrics-base.intra.yeshj.com/dashboard/db/jvm-notifycenter-mail-job-v170911-1624?orgId=2&from=1531670400000&to=1532275199999'),
//  MetricReportItem.createNew(2, '用户层通知中心', 'http://metrics-base.intra.yeshj.com/dashboard/db/jvm-notifycenter-postoffice-v170809-1457?orgId=2&from=1531065600000&to=1531670399000'),
//  MetricReportItem.createNew(1, 'DB', 'http://10.10.60.81/graph/dashboard/db/mysql-overview?refresh=1m&orgId=5&from=1531065600000&to=1531670399000&var-interval=1s&var-host=10.10.60.101')
//];
//
//chrome.storage.sync.get(['metricCaptureConfig'], function(data) {
//  if(!data.metricCaptureConfig) {
//    chrome.storage.sync.set({metricCaptureConfig: defaultMetricReportCfg}, function() {
//    })
//  }
//});

//chrome.runtime.onInstalled.addListener(function() {
//  chrome.storage.sync.set({theUrl: 'www.google.com'}, function() {
//    console.log('www.google.com');
//  });
//});
