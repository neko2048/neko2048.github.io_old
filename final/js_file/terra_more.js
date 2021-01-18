/** GLOBAL VARIABLES
 * 
*/
var lastreport = 0;	    // To stop trying to report when a report was already made of this time-point (either when paused or report-time is fast then simulation speed)
var paused = false;     // Global state to see if simulation is paused
var mixing = false;

/**
 * Some other CA functionality added by Bram van Dijk, 2018
*/

/**
	perfectMix :: A function to perfectly mix the grid
 */
terra.Terrarium.prototype.perfectMix = function () 
{
    for (var x = 0, _w = this.width; x < _w; x++) this.grid[x] = _.shuffle(this.grid[x]);
	this.grid = _.shuffle(this.grid);
	//console(this.grid[1].length);
	//console(this.grid.length);
	//for (var x = 0, _w = this.width; x < _w; x++)  this.grid[x] = _.shuffle(this.grid[x]);
	//this.grid = _.shuffle(this.grid);
		//{
		//for (var y = 0, _h = this.height; y < _h; y++) 
		//{
			//this.grid[x] = _.shuffle(this.grid[x]);
			//this.grid = _.shuffle(this.grid);
		//}
	//}
    //this.grid = _.shuffle(this.grid);
	
    if(!mixing)console("Mixed everything at time " + this.time);
	CA.draw();
};
/**
	A FUNCTION TO RUN THE MAIN LOOP
 * @param  {*} steps         steps to simulate, if not given it will simulate indefinitely
 */
terra.Terrarium.prototype.simulate = function (steps, fn) {
  function tick () {
    if(mixing)self.perfectMix();
    var grid = self.step();
    if (grid) {
      self.grid = grid;
      self.draw();
      if (++i !== steps) return self.nextFrame = requestAnimationFrame(tick);
    } // if grid hasn't changed || reached last step
    self.nextFrame = false;
    //if (fn) fn();
  }
  
  if (typeof steps === 'function') {
    fn = steps;
    steps = null;
  }

  if (!this.nextFrame) {
    
    var i = 0;
    var self = this;
    self.nextFrame = requestAnimationFrame(tick);
  }
};

/**
	A FUNCTION TO KILL SOME GUYS
 * @param  {*} s         state to kill
 * @param  {*} frac      fraction of individuals killed
 */
 
terra.Terrarium.prototype.killSome = function (s,frac) 
{
	var numkilled = 0;
	var numalive = 0;
	for (var x = 0, _w = this.width; x < _w; x++) {
		for (var y = 0, _h = this.height; y < _h; y++) {
			if(this.grid[x][y].state == s)
			{
				numalive++;
				if(Math.random() < frac)
				{
					this.grid[x][y].state = 0;
					numkilled++;
				}
			}
		}
	}
	individuals = 'mosquitoes'
	if(s == 2) individuals = 'spiders' 
	
	console('Killed '+numkilled+' out of '+numalive+' '+individuals+ ' at time ' + this.time);
};


/**
	A FUNCTION TO TOGGLE mix
	*/
terra.Terrarium.prototype.toggleMix = function () 
{
    if(document.getElementById('mix').checked) console('Permanent mixing enabled at time ' + this.time), mixing=true;
    else console('Permanent mixing disabled at time ' + this.time), mixing=false;
};


/**
	A FUNCTION TO REPORT SOME FEATURES
 * @return {grid}       a grid adhering to the above rules
 */
terra.Terrarium.prototype.reportLiving = function () 
{
	if(this.time == lastreport)	return;
	var numprey = 0;
	var numpred = 0;
	for (var x = 0, _w = this.width; x < _w; x++) {
		for (var y = 0, _h = this.height; y < _h; y++) {
			if(this.grid[x][y].state == 1) numprey++;
			if(this.grid[x][y].state == 2) numpred++;
		}
	}
	var report = 'Currently '+numprey+' mosquitoes and '+numpred+' spiders.';
	document.getElementById("console").innerHTML=report+"<br>"+document.getElementById("console").innerHTML;
	lastreport = this.time;
};

terra.Terrarium.prototype.getPopsize = function (s) 
{
	var popsize = 0;
	for (var x = 0, _w = this.width; x < _w; x++) {
		for (var y = 0, _h = this.height; y < _h; y++) {
			if(this.grid[x][y].state == s) popsize++;
		}
	}
	return popsize;
};
/**
	A FUNCTION TO REPORT THE CURRENT TIME
 * @return {grid}       a grid adhering to the above rules
 */
terra.Terrarium.prototype.reportTime = function (time)
{
	if(this.time == lastreport)	return;
	document.getElementById("time").innerHTML='Time: '+this.time
	lastreport = this.time;
}