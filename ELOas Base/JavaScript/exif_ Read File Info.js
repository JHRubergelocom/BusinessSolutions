// Read EXIF data from JPEG files
//
// usage:
//
// var myFileInfo = new Exif();
// myFileInfo.readFromFile("c:\\temp\\myPicture.jpg");
// var height = myFileInfo.valueOf("Image Height");
//
// var archiveDocInfo = new Exif();
// archiveDocInfo.readFromDoc(Sord.id);
// var xres = archiveDocInfo.valueOf("X Resolution");
//

importPackage(Packages.com.drew.imaging);
importPackage(Packages.com.drew.metadata);

function Exif() {
  this.metadata = null;
}

Exif.prototype.readFromFile = function(file) {
  if (file instanceof String) {
    file = new File(file);
  }
  
  this.metadata = ImageMetadataReader.readMetadata(file);
  
  this.map = new Array();
  var dirs = this.metadata.directories.iterator();
  while(dirs.hasNext()) {
    var dir = dirs.next();
    var tags = dir.tags.iterator();
    while (tags.hasNext()) {
      var tag = tags.next();
      this.map[tag.tagName] = tag.description;
      log.info("Tag: " + tag.tagName + " : " + tag.description);
    }
  }
}

Exif.prototype.readFromDoc = function(objid) {
  var tempFile = fu.getTempFile(objid);
  if (tempFile) {
    this.readFromFile(tempFile);
    fu.deleteFile(tempFile);
  }
}

Exif.prototype.valueOf = function(tagName) {
  return this.map[tagName];
}

Exif.prototype.getMetadata = function() {
 return this.metadata;
} 

Exif.prototype.getAllTags = function() {
  return this.map;
}

