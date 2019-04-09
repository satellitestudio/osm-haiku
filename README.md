# osm-haiku

## Run locally

- Run `npm i`
- Create an `app/config.js` file (`cp app/config-sample.js app/config.js`) and add tokens
- Run `npm start` and go to http://localhost:9094/
 
## Line rules

See `lines.en.json`

- `template` : Mandatory. The text that appears on a line when a rule is matched. Can be a string, or a function that returns a string and takes two arguments: `el`: the feature element, `env`: information about the environment (meteo, local time, etc)
- `tags` : If provided, matches against tags in a feature, in the form of: `[[feature key 0,feature value 0], [feature key n,feature value n]]`. If several key/features tuples are provided, uses an OR combination. See OSM <a href="https://wiki.openstreetmap.org/wiki/Map_Features">map features</a>. Both keys and values can _any_ using the `*` wildcard.
- `condition` : If provided, must be a function returning a boolean taht takes two arguments: `el`: the feature element, `env`: information about the environment (meteo, local time, etc)
- `needsName` : If set to true, feature must have a defined `name` to match.

### Environment object

- `moment`: 'night'|'morning'|'afternoon'|'evening'
- `temperature`: in °C
- `timeHour`: local hour 0-23

TBD:
- `sunny`
- `rain`
- `cloudy`
