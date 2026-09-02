export class ItemDetails {
    public id : number = 0;
    public name : string = "";
    public description : string = "";
    public price : number = 0;
    public ingredients : any;
    public image : string = "";

    public constructor(props: any ={}) {
      this.id=props.id
      this.name=props.name
      this.description=props.description ?? ''
      this.price=props.price
      this.image=props.image
    }
}
