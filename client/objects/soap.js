var Soap= function(position) {
    this.name = "soap";
    this.position = position;
	this.mesh = models.items[1][0].clone();
    this.mesh.position.copy(this.position);
    this.mesh.matrixWorld.makeTranslation(this.position.x,
                                          this.position.y,
                                          this.position.z);
};
