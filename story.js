module.exports = function(title, url, desc, src, img){
    var trim = 140;

    function stringTrim(str, trim){
       var concat = "...";
       if(str.length > trim-concat.length){
           return str.slice(0,trim-concat.length)+concat;
       }else{
        return str;
       }
    }

    this.title = title;
    this.url = url;
    this.desc = stringTrim(desc, trim);
    this.src = src;
    this.img = img;
    return this;
}
