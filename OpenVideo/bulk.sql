load data
local infile "p4records.txt"
replace into table p4records
fields terminated by '|'
(videoid,title,description,keywords,creationyear,sound,color,duration,durationsec,sponsorname,contribname,language,genre,keyframeurl)
;