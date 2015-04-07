#!/usr/bin/Rscript --vanilla
library(dplyr)
library(magrittr)
library(AnomalyDetection)

#setwd('~/workspace/metropolis')
args = commandArgs(TRUE)

input_file = args[1]
output_file = args[2]

allData = read.csv(input_file, header=T, stringsAsFactors=F, na.string="NULL")

summByCity = allData %>%
  group_by(city_name, measurement_timestamp) %>%
  summarize(temperature = mean(temperature),
            humidity = mean(humidity),
            light = mean(light),
            airquality_raw = mean(airquality_raw),
            sound = mean(sound),
            dust = mean(dust)) %>%
  ungroup %>%
  filter(complete.cases(.))

vars = names(summByCity)[-(1:2)]
cities = unique(summByCity$city_name)

calc_outliers = function(df, varname, plot=F){
  tmp = df %>%
    ungroup %>%
    select(measurement_timestamp, one_of(varname))

  posix_ts = strptime(tmp$measurement_timestamp, format="%Y-%m-%dT%H:%M:%S", tz = "GMT")
  rv = AnomalyDetectionTs(data.frame(posix_ts, tmp[[varname]]), direction="both", longterm=T, plot=T)
  anoms = rv$anoms
  anoms$measurement_timestamp = strftime(anoms$timestamp, format="%Y-%m-%dT%H:%M:%S")
  
  merged = merge(tmp, anoms, all.x=T)
  merged[[paste(varname,'_outlier', sep='')]] = !is.na(merged$anoms)

  merged_sub = select(merged, measurement_timestamp, one_of(varname), 
                      one_of(paste(varname, '_outlier', sep='')))
  names(merged_sub) = c('measurement_timestamp',
                    varname,
                    paste(varname, '_outlier', sep=''))
  if(plot){
    rv$plot
  } else { merged_sub}
}

by_city_outliers = function(df){
  final_dfs=list()
  for(i in 1:length(vars)){
    final_dfs[[i]] = calc_outliers(df, vars[i])
  }
  
  all_together = Reduce( function(...) merge(..., all=T), final_dfs)
  all_together
}

final_dfs = list()
for(i in 1:length(cities)){
  justOne = summByCity %>%
    filter(city_name == cities[i]) %>%
    by_city_outliers %>%
    mutate( city_name = cities[i])
  final_dfs[[i]] = justOne
}

all_together = Reduce( function(...) rbind(...), final_dfs)

write.table(all_together, output_file, sep=",", row.names=F, col.names=T)