export class UUID {
    static generate(length: Number) {
        var sGuid="";
        for (var i=0; i<length; i++)
         {
           sGuid+=Math.floor(Math.random()*0xF).toString(0xF);
         }
        return sGuid;
      }
}