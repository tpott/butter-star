
var Butter= function(position) {
    this.name = "butter";
    this.position = position;
	this.mesh = models.items[2][0].clone();
    this.mesh.position.copy(this.position);
    this.mesh.matrixWorld.makeTranslation(this.position.x,
                                          this.position.y,
                                          this.position.z);
};
