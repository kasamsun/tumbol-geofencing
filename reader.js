const parseKMZ = require("parse2-kmz");
const htmlparser2 = require("htmlparser2")
const domutils = require("domutils")
const { decode } = require('html-entities')
const fs = require('fs')

let countTumbol = 0
let countPolygon = 0

let writeStream = fs.createWriteStream('output.txt');

readFiles('./kmz/', (filename, content) => {
}, function(err) {
  throw err;
});


function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, async (err, filenames) => {
    if (err) {
      onError(err);
      return;
    }
    for (let filename of filenames) {
      console.log('./kmz/'+filename)
      let result = await parseKMZ.toJson('./kmz/'+filename)
      
      let count=0
      for (feature of result.features) {
        count++
        
        const dom = htmlparser2.parseDocument(feature.properties.description)
        let tcode = domutils.getInnerHTML(dom.children[0].children[3].children[1].children[3].children[1].children[1].children[9].children[3])
        let tumbol = domutils.getInnerHTML(dom.children[0].children[3].children[1].children[3].children[1].children[1].children[7].children[3])
        let tumbole = domutils.getInnerHTML(dom.children[0].children[3].children[1].children[3].children[1].children[1].children[5].children[3])
        let acode = domutils.getInnerHTML(dom.children[0].children[3].children[1].children[3].children[1].children[1].children[25].children[3])
        let amphur = domutils.getInnerHTML(dom.children[0].children[3].children[1].children[3].children[1].children[1].children[23].children[3])
        let amphure = domutils.getInnerHTML(dom.children[0].children[3].children[1].children[3].children[1].children[1].children[21].children[3])
        let pcode = domutils.getInnerHTML(dom.children[0].children[3].children[1].children[3].children[1].children[1].children[31].children[3])
        let province = domutils.getInnerHTML(dom.children[0].children[3].children[1].children[3].children[1].children[1].children[29].children[3])
        let provincee = domutils.getInnerHTML(dom.children[0].children[3].children[1].children[3].children[1].children[1].children[27].children[3])
        
        tumbole = tumbole.toLowerCase().replace(' ','')
        tumbole = tumbole.charAt(0).toUpperCase() + tumbole.slice(1)
        amphure = amphure.toLowerCase().replace(' ','')
        amphure = amphure.charAt(0).toUpperCase() + amphure.slice(1)
        provincee = provincee.toLowerCase().replace(' ','')
        provincee = provincee.charAt(0).toUpperCase() + provincee.slice(1)

        let geoinfo = feature.geometry.type
        if (feature.geometry.type == 'Polygon') {
          geoinfo += '(' + feature.geometry.coordinates[0].length + ')'
          countPolygon += feature.geometry.coordinates[0].length
        } else if (feature.geometry.type == 'GeometryCollection') { 
          geoinfo += ' ' + feature.geometry.geometries.map(item=>item.type + '(' + item.coordinates[0].length + ')')
          feature.geometry.geometries.forEach(item=>countPolygon+=item.coordinates[0].length)
        } else {
          geoinfo += feature.geometry
        }
        console.log(count + ' ' +  
          tcode + ':' + decode(tumbol) + ' ' + decode(tumbole) + ' ' + 
          acode + ':' + decode(amphur) + ' ' + decode(amphure) + ' ' +
          pcode + ':' + decode(province) + ' ' + decode(provincee) + ' ' + 
          geoinfo
        )
        writeStream.write(count + ' ' +  
        tcode + ':' + decode(tumbol) + ' ' + decode(tumbole) + ' ' + 
        acode + ':' + decode(amphur) + ' ' + decode(amphure) + ' ' +
        pcode + ':' + decode(province) + ' ' + decode(provincee) + ' ' + 
        geoinfo + '\n')
      }
      countTumbol += count

    }
 
    console.log('tumbol = ' + countTumbol + ' , polygon = ' + countPolygon)
    writeStream.end()
  });
}