library(RCurl)
library(jsonlite)
library(AnomalyDetection)
library(dplyr)
library(magrittr)

cities = c('San+Francisco', 'Bangalore','Boston', 'Rio+De+Janeiro','Geneva','Singapore','Shanghai')
query_prefix = "http://sensor-api.localdata.com/api/v1/aggregations?op=mean&over.city="
query_suffix = "&from=2015-02-01T00:00:00-0800&before=2015-02-28T00:00:00-0800&resolution=1h&fields=airquality_raw"
final_data = 
  query_city = function(c){
    url = paste(query_prefix, c, query_suffix, sep='')
    check_url = url.exists(url)
    if(check_url) curled = getURL(url)
    df = fromJSON(curled)
    df$data
  }
final_data = query_city(cities[1])
for(c in cities){
  final_data = rbind(final_data, query_city(c))
}

write.table(final_data, file='small_data.txt', sep=",",row.names=F,col.names=T)

#outlier check
#one city
one_city = filter(final_data, city == "San Francisco") %>%
res = AnomalyDetectionVec(one_city[,1], max_anoms=0.02, direction='both', plot=TRUE, period=168)
anoms = res$anoms

label_anoms = function(df, anom_list){
  labeled = mutate(df, anom=F)
  for(i in anom_list){
    labeled[i,'anom']=T
  }
  labeled
}

labeled = label_anoms(one_city, res$anoms)