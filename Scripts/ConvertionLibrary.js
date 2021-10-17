const { Module } = require("module");
const { parse } = require("path");
//Made with love <3 Catdotjs 2021
function UnitName(name){
    switch(name){

        ///-----------Metric-----------
        // Lenght
        case "cm":
        return "Centimeter";

        case "m":
        return "Meter";

        case "km":
        return "Kilometer";
        // Mass
        case "g":
        return "Grams";

        case "mg":
        return "Milligram";

        case "kg":
        return "Kilogram";

        // Volume
        case "l":
        return "Liter";

        case "ml":
        return "Milliliter";

        // Temperature
        case "c":
        return "Celsius";

        case "k":
        return "Kelvin";

        ///-----------Imperial-----------
        // Lenght
        case "\'\"":
        case "in":
        return "Inch";

        case "ft":
        return "Foot";

        case "ya":
        return "Yard";
        
        case "mi":
        return "Mile"
        // Mass
        case "oz":
        return "Ounce";

        case "lb":
        return "Pound";

        case "st":
        return "Stone";

        // Volume
        case "floz":
        return "Fluid Ounce";

        case "lg":
        return "Liquid Gallon";

        // Temperature
        case "f":
        return "Fahrenheit";

        ///-----------Time-----------
        case "ms":
        return "Millisecond";

        case "s":
        return "Second";

        case "mn":
        return "Minute";

        case "h":
        return "Hour";

        case "d":
        return "Day";

        case "w":
        return "Week";

        case "mo":
        return "Month";

        case "y":
        return "Year";
    }
}
const precision = 3;
const numbFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: precision });
module.exports = {
    TemperatureConvert : function(convert){
        /*
        *   convert = "20c"
        *   return "68F\n 293.15K"
        *   Supported = (c)elsius, (f)ahrenheit, (k)elvin
        *   C to K = C+273
        *   C to F = (C*1.8)+32
        */
       unit = convert.replace(/[ -9]/g,'');
       toConvert = parseFloat(convert.replace(/[a-z,A-Z, ]/g,""));
       switch(unit){
           case "c":
            return "``"+toConvert+" Celsius`` is **"+(toConvert+273.15).toFixed(precision)+" Kelvin** and **"+((toConvert*1.8)+32).toFixed(precision)+" Fahrenheit**";
           case "k":
            return "``"+toConvert+" Kelvin`` is **"+(toConvert-273.15).toFixed(precision)+" Celsius** and **"+(((toConvert-273.15)*1.8)+32).toFixed(precision)+" Fahrenheit**";
           case "f":
            return "``"+toConvert+" Fahrenheit`` is **"+((toConvert-32)/1.8).toFixed(precision)+" Celsius** and **"+(((toConvert-32)/1.8)+273.15).toFixed(precision)+" Kelvin**";
           default:
            return `unit is wrong or missing >m<!
            ->For Temperature: **C**, **K** and **F** are allowed.`;
       }
    },

    AngleConvert : function(convert) {
        //Degree to Radian / Radian to Degree
        toConvert = parseFloat(convert.replace(/[a-z,A-Z, ]/g,""));
        if(convert.endsWith("d")){
            return "``"+toConvert+" Degree(s)`` is **"+(toConvert*(Math.PI/180)).toFixed(precision+4)+" Radian(s)**";
        }else if(convert.endsWith("r")){ 
            return "``"+toConvert+" Radian(s)`` is **"+(toConvert*(180/Math.PI)).toFixed(precision+4)+" Degree(s)**";
        }else{
            return `unit is wrong or missing >m<!
            ->For Angle: **R** and *D** are allowed.`;
        }
    },

    TimeConvert : function(convert){
        const timeUnits = ["ms","s","mn","h","d","w","mo","y"];
        let unit = convert.replace(/[ -9]/g,'');
        if(timeUnits.includes(unit)) {
            let toConvert = parseFloat(parseFloat(convert.replace(/[a-z,A-Z, ]/g,"")));
            let returnText = "``"+toConvert+" "+UnitName(unit)+"(s)`` is\n";

            switch(unit){
                case timeUnits[0]: //milliseconds
                 millisecond = toConvert;
                break;

                case timeUnits[1]: //seconds
                 millisecond = toConvert*1000;
                break;

                case timeUnits[2]: //minutes
                 millisecond = toConvert*1000*60;
                break;

                case timeUnits[3]: //hours
                 millisecond = toConvert*1000*60*60;
                break;

                case timeUnits[4]: //days
                 millisecond = toConvert*1000*60*60*24;
                break;

                case timeUnits[5]: //weeks
                 millisecond = toConvert*1000*60*60*24*7;
                break;

                case timeUnits[6]: //months
                 millisecond = toConvert*1000*60*60*24*7*4.34524;
                break;

                case timeUnits[7]: //years
                 millisecond = toConvert*1000*60*60*24*365;
                break;

                default:
                return "error";
            }

            second = millisecond/1000;
            minute = second/60;
            hour = minute/60;
            day = hour/24;
            week = day/7;
            month = week/4.34524;
            year = day/365;

            convertedNumbers=[millisecond,second,minute,hour,day,week,month,year];
            for(let i=0;i<convertedNumbers.length;i++){
                returnText+=(unit!=timeUnits[i]?"**"+numbFormat.format(convertedNumbers[i].toFixed(precision))+" "+UnitName(timeUnits[i])+"(s)**\n":"");
            }

            return returnText;
        }else{
            return `unit is wrong or missing >m<!
            ->For Time: **${timeUnits[0]}**, **${timeUnits[1]}**, **${timeUnits[2]}**, **${timeUnits[3]}**, **${timeUnits[4]}**, **${timeUnits[5]}**, **${timeUnits[6]}** and **${timeUnits[7]}** are allowed.`; 
        }
    },

    MassConvert : function(convert){
        const metric = ["mg","g","kg"];
        const imperial = ["oz","lb","st"];

        let unit = convert.replace(/[ -9]/g,'');
        let toConvert = parseFloat(convert.replace(/[a-z,A-Z, ]/g,""));
        let returnText = "``"+toConvert+" "+UnitName(unit)+"(s)`` is";

        if(metric.includes(unit)){
            switch(unit){
                case metric[0]:
                 oz = toConvert/28350;
                break;

                case metric[1]:
                 oz = toConvert/28.35;
                break;

                case metric[2]:
                 oz = toConvert*35.274;
            }

            lb = oz/16;
            st = lb/14;
            
            convertedNumbers = [oz,lb,st];

            for(let i=0;i<convertedNumbers.length;i++){
                returnText+=" **"+numbFormat.format(convertedNumbers[i].toFixed(precision))+" "+UnitName(imperial[i])+"(s)**";
            }
        }else if(imperial.includes(unit)){
            switch(unit){
                case imperial[0]:
                 mg = toConvert*28350;
                break;

                case imperial[1]:
                 mg = toConvert*453592;
                break;

                case imperial[2]:
                 mg = toConvert*6.35e+6;
            }
            g = mg/1000;
            kg = g/1000;

            convertedNumbers = [mg,g,kg];

            for(let i=0;i<convertedNumbers.length;i++){
                returnText+=" **"+numbFormat.format(convertedNumbers[i].toFixed(precision))+" "+UnitName(metric[i])+"(s)**";
            }
        }else{
            return `unit is wrong or missing >m<!
            ->For metric: **${metric[0]}**, **${metric[1]}** and **${metric[2]}** are allowed.
            ->For imperial: **${imperial[0]}**, **${imperial[1]}** and **${imperial[2]}** are allowed.`;
        }
        return returnText;
    },

    VolumeConvert : function(convert){
        const metric = ["ml","l"];
        const imperial = ["floz","lg"];

        let unit = convert.replace(/[ -9]/g,'');
        let toConvert = parseFloat(convert.replace(/[a-z,A-Z, ]/g,""));
        let returnText = "``"+toConvert+" "+UnitName(unit)+"(s)`` is";
        if(metric.includes(unit)){
            switch(unit){
                case metric[0]:
                 floz = toConvert/29.574;
                break;

                case metric[1]:
                 floz = toConvert*33.814;
                break;
            }

            lg = floz/128;
            
            convertedNumbers = [floz,lg];

            for(let i=0;i<convertedNumbers.length;i++){
                returnText+=" **"+numbFormat.format(convertedNumbers[i].toFixed(precision))+" "+UnitName(imperial[i])+"(s)**";
            }
        }else if(imperial.includes(unit)){
            switch(unit){
                case imperial[0]:
                 ml = toConvert*29.574;
                break;

                case imperial[1]:
                 ml = toConvert*3785;
                break;
            }
            l= ml/1000;
            convertedNumbers = [ml,l];
            for(let i=0;i<convertedNumbers.length;i++){
                returnText+=" **"+numbFormat.format(convertedNumbers[i].toFixed(precision))+" "+UnitName(metric[i])+"(s)**";
            }
        }else{
           return `unit is wrong or missing >m<!
           ->For metric: **${metric[0]}** and **${metric[1]}** are allowed.
           ->For imperial: **${imperial[0]}** and **${imperial[1]}** are allowed.`;
        }
        return returnText;
    },

    LengthConvert : function(convert){
        const metric = ["cm","m","km"];
        const imperial = ['in',"ft","ya","mi"];
        const imperialSpecialCase = "\'\"";

        let unit = convert.replace(/[(-9]/g,'');
        let toConvert = parseFloat(convert.replace(/[a-z,A-Z, ]/g,""));
        let returnText = "``"+toConvert+" "+UnitName(unit)+"(s)`` is";

        if(metric.includes(unit)){
            switch(unit){
                case metric[0]:
                 inch = toConvert/2.54;
                break;

                case metric[1]:
                 inch = toConvert*39.3701;
                break;

                case metric[2]:
                 inch = toConvert*39370.1;
                break;
            }

            ft = inch/12;
            ya = ft/3;
            mi=ya/1760;

            convertedNumbers = [inch,ft,ya,mi];

            for(let i=0;i<convertedNumbers.length;i++){
                returnText+=" **"+numbFormat.format(convertedNumbers[i].toFixed(precision))+" "+UnitName(imperial[i])+"(s)**";
            }
            returnText+=" **"+Math.floor(ft)+"\'"+Math.floor(inch%12)+"\""+"**";
        }else if(imperial.includes(unit)||imperialSpecialCase==unit){
            switch(unit){
                case imperial[0]:
                 cm = toConvert*2.54;
                break;

                case imperial[1]:
                 cm = toConvert*30.48;
                break;

                case imperial[2]:
                 cm = toConvert*91.44;
                break;

                case imperial[3]:
                 cm = toConvert*160934;
                break;

                case imperialSpecialCase:
                 ftin = convert.replace("\"","").split("\'");
                 toConvert = (ftin[0]*12 + ftin[1]*1);
                 returnText = "``"+toConvert+" "+UnitName(unit)+"(s)`` is";
                 cm =  toConvert*2.54;
                break;
            }
            m = cm/100;
            km = m/1000;

            convertedNumbers = [cm,m,km];

            for(let i=0;i<convertedNumbers.length;i++){
                returnText+=" **"+numbFormat.format(convertedNumbers[i].toFixed(precision))+" "+UnitName(metric[i])+"(s)**";
            }
        }else{
        return `unit is wrong or missing >m<!
            ->For metric: **${metric[0]}**, **${metric[1]}** and **${metric[2]}** are allowed.
            ->For imperial: **${imperial[0]}**, **${imperial[1]}**, **${imperial[2]}** and **${imperial[3]}**(or **\'**(feet) and **\"**(inch) symbols) are allowed.`;
        }
        return returnText;
    },

    UnitToName : function(convertName){
        UnitName(convertName);
    }
}
