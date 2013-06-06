var Battery = function(position) {
    this.name = "battery";
    this.position = position;
	this.mesh = models.items[0][0].clone();
    this.mesh.position.copy(this.position);
    this.mesh.matrixWorld.makeTranslation(this.position.x,
                                          this.position.y,
                                          this.position.z);
};
