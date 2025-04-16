import pycountry
import json

data = {
    "Austria", "Belgium", "Bulgaria", "Croatia", "Republic of Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"
}

def get_iso3(country_name):
    try:
        if country_name == "Kosovo":
            return "XKX"
        elif country_name == "Ivory Coast":
            return "CIV"
        elif country_name == "Republic of the Congo":
            return "COG"
        elif country_name == "Democratic Republic of the Congo":
            return "COD"
        elif country_name == "Macedonia":
            return "MKD"
        elif country_name == "South Korea":
            return "KOR"
        elif country_name == "North Korea":
            return "PRK"
        elif country_name == "Syria":
            return "SYR"
        elif country_name == "Republic of Serbia":
            return "SRB"
        elif country_name == "European Union":
            return "EUU"
        else:
            return pycountry.countries.lookup(country_name).alpha_3
    except LookupError:
        return None

# transformed = {get_iso3(name): value for name, value in data.items() if get_iso3(name)}
transformed = [get_iso3(name) for name in data]

print(json.dumps(transformed))

