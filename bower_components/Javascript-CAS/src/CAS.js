function Queue(){
	var array=[];
	this.add=function(steve){
		array.unshift(steve);
	};
	this.remove=function(){
		return array.shift();
	};
	this.peek=function(){
		return array[0];
	};
	this.empty=function(){
		return (array.length===0);
	};
	this.getArray=function(){
		return array;
	};
}
function Stack(arr){
	var array;
	if(arr===undefined){
		array=[];
	}else{
		array=arr;
	}
	this.empty=function(){
		return (array.length===0);
	};
	this.peek=function(){
		return array[array.length-1];
	};
	this.pop=function(){
		return array.pop();
	};
	this.push=function(steve){
		array.push(steve);
	};
	this.length=function(){
		return array.length;
	};
	this.getArray=function(){
		return array;
	};
}function tokenize(expression) {
	var tokens = [ "[A-Za-z_][A-Za-z_\d]*", "\\(", "\\)", "\\+", "-", "\\*",
			"/", "\\^", "\\d+(?:\\.\\d*)?" ];
	var rtok = new RegExp("\\s*(?:(" + tokens.join(")|(") + "))\\s*", "g");
	var toks = [], p;
	rtok.lastIndex = p = 0; // reset the regex

	var VARIABLE = 0;
	var FUNCTION = 1;
	var OPEN_PARENTHESIS = 2;
	var CLOSE_PARENTHESIS = 3;
	var OPERATOR = 4;
	var NUMBER = 5;

	var LEFT_ASSOCIATIVE = 0;
	var RIGHT_ASSOCIATIVE = 1;

	var ADDITION = 4;
	var SUBTRACTION = 5;
	var MULTIPLICATION = 6;
	var DIVISION = 7;
	var EXPONENTATION = 8;
	while (rtok.lastIndex < expression.length) {

		var match = rtok.exec(expression);
		/*
		 * Make sure we found a token, and that we found one without skipping
		 * garbage
		 */


		if (!match || rtok.lastIndex - match[0].length !== p)
			throw new SyntaxError();

		// Figure out which token we matched by finding the non-null group
		for ( var i = 1; i < match.length; ++i) {
			if (match[i]) {
				var type, precedence = null, associativity = null, operands = null, txt = match[i];
				if (i == FUNCTION) {

					if (match[i].length == 1) {
						type = VARIABLE;
						if (match[i] == "e") {
							type = NUMBER;
						}

					} else if (match[i] == "pi") {
						type = NUMBER;
					} else {
						type = FUNCTION;
						operands = 1;
						precedence = 100;
					}
				} else if (i == OPEN_PARENTHESIS) {
					type = OPEN_PARENTHESIS;
				} else if (i == CLOSE_PARENTHESIS) {
					type = CLOSE_PARENTHESIS;
				} else if (i <= 8) {
					type = OPERATOR;
					operands = 2;
					if (i == ADDITION) {
						precedence = 1;
						associativity = LEFT_ASSOCIATIVE;
					} else if (i == SUBTRACTION) {
						precedence = 1;
						associativity = LEFT_ASSOCIATIVE;
						var previous = (toks.length > 0) ? toks[toks.length - 1]: null;

						if (toks.length == 0 || previous.type == 4 || previous.type == 2) {
							precedence = 10;
							associativity = RIGHT_ASSOCIATIVE;
							txt = "-";
							operands = 1;
						}
					} else if (i == 6 || i == 7) {
						precedence = 5;
						associativity = LEFT_ASSOCIATIVE;
					} else {
						precedence = 10;
						associativity = RIGHT_ASSOCIATIVE;
					}

				} else {
					type = NUMBER;
				}
				toks.push({
					id : i,
					txt : txt,
					type : type,
					associativity : associativity,
					precedence : precedence,
					operands : operands
				});

				// remember the new position in the string
				p = rtok.lastIndex;
				break;
			}
		}
	}

	var multiply = {
		"id" : 6,
		"txt" : "*",
		"type" : 4,
		"associativity" : 0,
		"precedence" : 5,
		"operands" : 2
	}
	for ( var i = 1; i < toks.length;) {
		if ((toks[i].type == FUNCTION || toks[i].type == VARIABLE)
				&& (toks[i - 1].type == NUMBER || toks[i - 1].type == CLOSE_PARENTHESIS)) {

			toks.splice(i, 0, multiply);
		} else if (toks[i].type == OPEN_PARENTHESIS
				&& (toks[i - 1].type != OPERATOR && toks[i - 1].type != FUNCTION)) {
			toks.splice(i, 0, multiply);
		} else {
			i++;
		}
	}
	return toks;
}

function shunt(expression) {
	var VARIABLE = 0;
	var FUNCTION = 1;
	var OPEN_PARENTHESIS = 2;
	var CLOSE_PARENTHESIS = 3;
	var OPERATOR = 4;
	var NUMBER = 5;
	var LEFT_ASSOC = 0;
	var RIGHT_ASSOC = 1

	var shouldItBeAdded = function(stack) {
		return (!stack.empty() && (stack.peek().type == OPERATOR && ((token.associativity == LEFT_ASSOC && token.precedence == stack
				.peek().precedence) || (token.precedence < stack.peek().precedence))));
	};

	var array = tokenize(expression);

	var output = new Queue();
	var stack = new Stack();
	for ( var i = 0; i < array.length; i++) {
		var token = array[i];
		if (token.type == NUMBER || token.type == VARIABLE) {
			output.add(token);
		} else if (token.type == FUNCTION) {
			stack.push(token);
		} else if (token.type == OPERATOR) {

			while (shouldItBeAdded(stack)) {

				output.add(stack.pop());
			}
			stack.push(token);
		} else if (token.type == OPEN_PARENTHESIS) {
			stack.push(token);
		} else if (token.type == CLOSE_PARENTHESIS) {
			while (stack.peek() !== undefined
					&& stack.peek().type !== OPEN_PARENTHESIS) {

				output.add(stack.pop());

			}
			stack.pop();
			if (stack.peek() !== undefined && stack.peek().type == FUNCTION) {
				output.add(stack.pop());
			}
		}

	}
	while (!stack.empty()) {
		output.add(stack.pop());
	}

	return output.getArray().reverse();
}

/*
 * Converting a postfix array into a syntax tree Example: Infix: 1+(2*3)
 * Postfix: 1 2 3 * + Desired Tree: + / \ 1 * /\ 2 3
 *
 * Slightly more complicated algorithm Infix: 1+(2*3)/sin(4) Postfix: 1 2 3 * 4
 * sin / + Human running algorithm: Stack: [] Push values until operator reached
 * Stack: [1,2,3] Operator reached: *, takes two arguments pop two values off of
 * stack, create new operator from that, push Stack: [1,multiply(2,3)] Read
 * until operator Stack: [1,multiply(2,3),4] Operator reached (sin), takes 1
 * argument Pop one value of of stack, create new operator, push
 * Stack[1,multiply(2,3),sin(4)] Operator reached (/), takes two arguments
 * Stack[1,divide(multiply(2,3),sin(4))] Operator reached (+), takes two
 * arguments
 *
 * And we are done
 *
 * Tree derived from that add / \ 1 divide / \ multiply sin / \ \ 2 3 4
 *
 *
 * Algorithm derived (slight modification from the normal Postfix) 1. Create
 * empty stack 2. Iterate through postfix tokens a. If token is a value (number,
 * variable) i. Push it to stack b. If it is a function or operator i. Create
 * new operator instance` ii. Determine how many operands the function or
 * operator takes, henceforth known as n iii. Pop n values from the stack, and
 * set them as the operands of the operator iv. Push the operator back onto the
 * stack 3. Error handling a. If there is one value on the stack, it is your
 * tree, with an operator as the head element b. Otherwise, we screwed up
 */
function toTree(array) {
	var VARIABLE = 0;
	var FUNCTION = 1;
	var OPERATOR = 4;
	var NUMBER = 5;
	var stack = new Stack();
	for ( var i = 0; i < array.length; i++) {
		var token = array[i];

		if (token.type == VARIABLE || token.type == NUMBER) {
			stack.push(new Operand(token));
		} else if (token.type == FUNCTION || token.type == OPERATOR) {

			var numOperands = token.operands;
			if (numOperands == 1) {

				var operator = new Unary(token);
				operator.operand = stack.pop();

			} else {

				var operator = new Binary(token);
				var right = stack.pop();
				var left = stack.pop();
				operator.left = left;
				operator.right = right;
			}
			stack.push(operator);
		}
	}
	if (stack.length() == 1) {
		return stack.pop();
	} else {
		throw new Error("We screwed up somewhere");
	}
}

function toInfix(tree, str, parent) {
	var infix = str || "";
	if (parent) {
		var precedence = parent.precedence;
	} else {
		var precedence = 0;
	}
	var result;

	if (tree instanceof Operand) {
		result = tree.txt;
	} else if (tree instanceof Binary) {

		if (tree.precedence < precedence
				|| (tree.precedence == precedence && parent.txt == "/")) {
			result = "(" + toInfix(tree.left, str, tree) + tree.txt
					+ toInfix(tree.right, str, tree) + ")";
		} else {

			result = toInfix(tree.left, str, tree) + tree.txt
					+ toInfix(tree.right, str, tree);
		}
	} else if (tree instanceof Unary) {
		result = tree.txt + "(" + toInfix(tree.operand) + ")";
	}

	return result;
}

function toTex(tree, str, parent) {
	var tex = str || "";
	if (parent) {
		var precedence = parent.precedence;
	} else {
		var precedence = 0;
	}

	var txt = tree.txt;

	var result;
//	console.log(displayTree(tree));
	if(txt == "*") {
		txt = "\\cdot";
	}

	if (tree instanceof Operand) {
		return (tree.tex) ? tree.tex : txt;

	} else if (tree instanceof Binary) {
		if(txt == "^") {
			if(tree.left instanceof Operand) {
				result = "{{" + toTex(tree.left, str, tree) + "}^{" + toTex(tree.right, str, tree) + "}}";
			}else {
				result = "{{\\left(" + toTex(tree.left, str, tree) + "\\right)}^{" + toTex(tree.right, str, tree) + "}}";

			}
		}else if(txt == "/") {
			result = "{\\frac{" + toTex(tree.left, str, tree) + "}" + "{" + toTex(tree.right, str, tree) + "}}";

		}else if (tree.precedence < precedence && parent.txt != "^" && parent.txt != "/") {



			result = "\\left({{" + toTex(tree.left, str, tree)+"}" + txt
					+ "{" + toTex(tree.right, str, tree) + "}}\\right)";
		} else {


			result = "{{" + toTex(tree.left, str, tree) + "}" + txt + "{" + toTex(tree.right, str, tree) + "}}";
		}

	} else if (tree instanceof Unary) {
		if (txt == "-") {
			result = "-{" + toTex(tree.operand, str, tree) + "}";

		} else {
			result = "\\" + txt + "{" + toTex(tree.operand, str, tree) + "}";
		}
	}

	return result;
}


function Unary(token, operand) {
	var uOps = {
		"-" : {
			"id" : 5,
			"txt" : "-",
			"type" : 4,
			"associativity" : 1,
			"precedence" : 10,
			"operands" : 1
		},
		"sin" : {
			"id" : 1,
			"txt" : "sin",
			"type" : 1,
			"associativity" : null,
			"precedence" : 100,
			"operands" : 1
		},
		"cos" : {
			"id" : 1,
			"txt" : "cos",
			"type" : 1,
			"associativity" : null,
			"precedence" : 100,
			"operands" : 1
		},
		"tan" : {
			"id" : 1,
			"txt" : "tan",
			"type" : 1,
			"associativity" : null,
			"precedence" : 100,
			"operands" : 1
		},
		"csc" : {
			"id" : 1,
			"txt" : "csc",
			"type" : 1,
			"associativity" : null,
			"precedence" : 100,
			"operands" : 1
		},
		"sec" : {
			"id" : 1,
			"txt" : "sec",
			"type" : 1,
			"associativity" : null,
			"precedence" : 100,
			"operands" : 1
		},
		"cot" : {
			"id" : 1,
			"txt" : "cot",
			"type" : 1,
			"associativity" : null,
			"precedence" : 100,
			"operands" : 1
		},

		"arcsin" : {
			"id" : 1,
			"txt" : "arcsin",
			"type" : 1,
			"associativity" : null,
			"precedence" : 100,
			"operands" : 1
		},
		"arccos" : {
			"id" : 1,
			"txt" : "arccos",
			"type" : 1,
			"associativity" : null,
			"precedence" : 100,
			"operands" : 1
		},
		"arctan" : {
			"id" : 1,
			"txt" : "arctan",
			"type" : 1,
			"associativity" : null,
			"precedence" : 100,
			"operands" : 1
		},
		"arccsc" : {
			"id" : 1,
			"txt" : "arccsc",
			"type" : 1,
			"associativity" : null,
			"precedence" : 100,
			"operands" : 1
		},
		"arcsec" : {
			"id" : 1,
			"txt" : "arcsec",
			"type" : 1,
			"associativity" : null,
			"precedence" : 100,
			"operands" : 1
		},
		"arccot" : {
			"id" : 1,
			"txt" : "arccot",
			"type" : 1,
			"associativity" : null,
			"precedence" : 100,
			"operands" : 1
		},

		"log" : {
			"id" : 1,
			"txt" : "log",
			"type" : 1,
			"associativity" : null,
			"precedence" : 100,
			"operands" : 1
		},
		"ln" : {
			"id" : 1,
			"txt" : "ln",
			"type" : 1,
			"associativity" : null,
			"precedence" : 100,
			"operands" : 1
		},
		"sqrt" : {
			"id" : 1,
			"txt" : "sqrt",
			"type" : 1,
			"associativity" : null,
			"precedence" : 100,
			"operands" : 1
		},



		"abs" : {
			"id" : 1,
			"txt" : "abs",
			"type" : 1,
			"associativity" : null,
			"precedence" : 100,
			"operands" : 1
		}

	};
	if (typeof token === "string") {
		token = uOps[token];
	}
	this.txt = token.txt;
	this.operand = operand || null;

	this.associativity = token.associativity;
	this.precedence = token.precedence;

}

Unary.prototype.isVariable = function(wrt) {
	return this.operand.isVariable(wrt);
};

Unary.prototype.evaluate = function(variables) {

	var operand = this.operand.evaluate(variables);

	var evaluations = {
		"-" : function(operand) {
			return -operand;
		},
		"abs" : function(operand) {
			return Math.abs(operand);
		},

		"sqrt" : function(operand) {
			return Math.sqrt(operand);
		},

		"ln" : function(operand) {
			return Math.log(operand);
		},

		"log" : function(operand) {
			return Math.log(operand) / Math.log(10);
		},

		"sin" : function(operand) {
			return Math.sin(operand);
		},

		"cos" : function(operand) {
			return Math.cos(operand);
		},

		"tan" : function(operand) {
			return Math.tan(operand);
		},

		"csc" : function(operand) {
			return 1 / Math.sin(operand);
		},

		"sec" : function(operand) {
			return 1 / Math.cos(operand);
		},

		"cot" : function(operand) {
			return 1 / Math.tan(operand);
		},

		"arcsin" : function(operand) {
			return Math.asin(operand);
		},

		"arccos" : function(operand) {
			return Math.acos(operand);
		},

		"arctan" : function(operand) {
			return Math.atan(operand);
		},

		"arccsc" : function(operand) {
			return Math.asin(1 / operand);
		},

		"arcsec" : function(operand) {
			return Math.acos(1 / operand);
		},

		"arccot" : function(operand) {
			return Math.atan(1 / operand);
		}
	};

	return evaluations[this.txt](operand);
};

Unary.prototype.differentiate = function(respect, show){

	var wrt = respect || "x";

	var show = show || false;

	var dOperand = this.operand.differentiate(wrt, show);
	var operand = this.operand;
	var derivatives = {
			"-": function(operand) {
				return new Unary("-", dOperand);
			},

			"ln": function(operand) {
				return new Binary("/", dOperand, operand);
			},

			"log": function(operand) {
				return new Binary("/", dOperand,
						new Binary("*", operand,
								new Unary("ln", new Operand("10")
								)
						)
				);
			},

			"sqrt": function(operand) {
				return new Binary("/",
						dOperand,
						new Binary("*",
								new Operand("2"),
								new Unary("sqrt", operand)
						)
				);
			},

			"sin": function(operand) {
				return new Binary("*",
						new Unary("cos", operand),
						dOperand
				);
			},

			"cos": function(operand) {
				return new Unary("-",
						new Binary("*",
								new Unary("sin", operand),
								dOperand
						)
				);
			},

			"tan": function(operand) {
				return new Binary("*",
						new Binary("^",
								new Unary("sec", operand), new Operand("2")),
								dOperand);
			},

			"csc": function(operand) {
				return new Binary("*",
						new Binary("*",
								new Unary("cot", operand),
								new Unary("csc", operand)
						), dOperand
				);
			},

			"sec": function(operand) {
				return new Binary("*",
						new Binary("*",
								new Unary("sec", operand),
								new Unary("tan", operand)
						),
						dOperand
				);
			},

			"cot": function(operand) {
				return new Unary("-",
						new Binary("*",
								new Binary("^",
										new Unary("csc", operand),
										new Operand("2")), dOperand)
				);
			},

			"arcsin": function(operand) {
				return new Binary("/",
						dOperand,
						new Unary("sqrt",
								new Binary("-",
										new Operand("1"),
										new Binary("^",
												operand,
												new Operand("2")
										)
								)
						)
				);
			},

			"arccos": function(operand) {
				return new Unary("-",
						new Binary("/",
								dOperand,
								new Unary("sqrt",
										new Binary("-",
												new Operand("1"),
												new Binary("^",
														operand,
														new Operand("2")
												)
										)
								)
						)
				);
			},

			"arctan" : function(operand) {
				return new Binary("/",
						dOperand,
						new Binary("+",
								new Operand("1"),
								new Binary("^", operand,
										new Operand("2")
								)
						)
				);
			},

			"arccsc": function(operand) {
				return new Binary("/",
						dOperand,
						new Binary("*",
								new Unary("abs", operand),
								new Unary("sqrt",
										new Binary("-",
												new Binary("^",
														operand,
														new Operand("2")
												),
												new Operand("1")
										)
								)
						)
				);
			},

			"arcsec": function(operand) {
				return new Binary("/",
						dOperand,
						new Binary("*",
								new Unary("abs", operand),
								new Unary("sqrt",
										new Binary("-",
												new Binary("^",
														operand,
														new Operand("2")
												),
												new Operand("1")
										)
								)
						)
				);
			},

			"arccot": function(operand) {
				return new Unary("-",
						new Binary("/",
								dOperand,
								new Binary("+",
										new Operand("1"),
										new Binary("^", operand,
												new Operand("2")
										)
								)
						)
				);
			}


	};

	var result = derivatives[this.txt](operand);

	if(show) {
		resultsDiv.innerHTML += ("$$\\text{Differentiating }" + toTex(this) + "\\text{ gives }" + toTex(result.simplify()) + "$$<br>");
	}
	return result;
};

Unary.prototype.standardize = function() {
	this.operand = this.operand.standardize();
	return this;
};

Unary.prototype.simplify = function(respect) {
	var wrt = respect || "x";
	if(!this.isVariable(wrt)) {
		var ans = this.evaluate();

		var frac = new Fraction(ans);

		if(frac.numerator > 1e5 || frac.denominator > 1e5) {
			this.operand = this.operand.simplify();
			var result = new Operand(ans);
			result.txt = new Equation(this).toString();
			result.tex = toTex(this);
			return result;



		}

		if(ans < 0) {

			return new Unary("-", new Operand((-ans).toString()));
		} else {
			return new Operand(ans.toString());
		}
	} else {
		this.operand = this.operand.simplify();
		return this;
	}
};

Unary.prototype.compile = function() {

	var inside = this.operand.compile();
	if(this.txt == "-") {
		return "-" +inside;
	} else if (this.txt == "ln") {
		return "Math.log(" + inside + ")";
	} else if (this.txt == "log") {
		return "Math.log(" + inside + ")/2.302585092994046";
	} else if (this.txt == "csc") {
		return "1/Math.sin(" + inside + ")";
	} else if(this.txt == "sec") {
		return "1/Math.cos(" + inside + ")";
	} else if(this.txt == "cot") {
		return "1/Math.tan(" + inside + ")";
	} else if(this.txt == "arcsin") {
		return "Math.asin(" + inside + ")";
	} else if (this.txt == "arccos") {
		return "Math.acos(" + inside + ")";
	} else if(this.txt == "arctan") {
		return "Math.atan(" + inside + ")";
	} else if(this.txt == "arccsc") {
		return "Math.asin(1/(" + inside + "))";
	} else if(this.txt == "arcsec") {
		return "Math.asin(1/(" + inside + "))";
	} else if(this.txt == "arccot") {
		return "Math.PI/2 - Math.atan(" + inside + ")";
	} else {
		return "Math." + this.txt + "(" + inside + ")";
	}
}
function Binary(token, left, right) {

    var bOps = {
	"+" : {
	    "id" : 4,
	    "txt" : "+",
	    "type" : 4,
	    "associativity" : 0,
	    "precedence" : 1,
	    "operands" : 2
	},
	"-" : {
	    "id" : 5,
	    "txt" : "-",
	    "type" : 4,
	    "associativity" : 1,
	    "precedence" : 1,
	    "operands" : 1
	},
	"*" : {
	    "id" : 6,
	    "txt" : "*",
	    "type" : 4,
	    "associativity" : 0,
	    "precedence" : 5,
	    "operands" : 2
	},
	"/" : {
	    "id" : 7,
	    "txt" : "/",
	    "type" : 4,
	    "associativity" : 0,
	    "precedence" : 5,
	    "operands" : 2
	},
	"^" : {
	    "id" : 8,
	    "txt" : "^"  ,
	    "type" : 4,
	    "associativity" : 1,
	    "precedence" : 10,
	    "operands" : 2
	}
    };

    if (typeof token === "string") {
	token = bOps[token];
    }
    this.txt = token.txt;
    this.left = left || null;
    this.right = right || null;

    this.associativity = token.associativity;
    this.precedence = token.precedence;
}

Binary.prototype.isVariable = function(wrt) {
    return (this.left.isVariable(wrt) || this.right.isVariable(wrt));
};



Binary.prototype.evaluate = function(variables) {
    var left = this.left.evaluate(variables);
    var right = this.right.evaluate(variables);

    if (this.txt == "+") {
	return left + right;
    } else if (this.txt == "-") {
	return left - right;
    } else if (this.txt == "*") {
	return left * right;
    } else if (this.txt == "/") {
	return left / right;
    } else if (this.txt == "^") {
	return Math.pow(left, right);
    } else {
	console.log(displayTree(this));
	throw new SyntaxError("Unidentified Flying Binary Operator detected");
    }
};

Binary.prototype.differentiate = function(respect, show) {



    var wrt = respect || "x";

    var left = this.left;
    var right = this.right;

    var show = show || false;

    var dLeft = this.left.differentiate(wrt, show);
    var dRight = this.right.differentiate(wrt, show);
    var result = null;
    if(this.txt == "+") {
	result = new Binary("+", dLeft, dRight);
    }else if(this.txt == "-") {
	result = new Binary("-", dLeft, dRight);
    }else if(this.txt == "*") {
	result = new Binary("+",
			    new Binary("*", left, dRight),
			    new Binary("*", right, dLeft)
			   );
    }else if(this.txt == "/") {
	result = new Binary("/",
			    new Binary("-",
				       new Binary("*", right, dLeft),
				       new Binary("*", left, dRight)
				      ),
			    new Binary("^", right, new Operand("2"))
			   );
    }else if(this.txt == "^") {
	var powerRule = new Binary("*",
				   new Binary("*", right,
					      new Binary("^", left,
							 new Binary("-", right, new Operand("1")
								   )
							)
					     ),
				   dLeft);


	var exponentRule = new Binary("*",
				      new Binary("*",
						 new Binary("^", left, right),
						 dRight
						), new Unary("ln", left)
				     );

	if(left.isVariable(wrt) && right.isVariable(wrt)) {
	    result = new Binary("+", powerRule, exponentRule);
	}else if(left.isVariable(wrt) && !right.isVariable(wrt)) {
	    result = powerRule;
	}else if(!left.isVariable(wrt) && right.isVariable(wrt)) {
	    result = exponentRule;
	}else{
	    result = new Operand("0");
	}
    }
    if(show) {
	resultsDiv.innerHTML += ("$$\\text{Differentiating }" + toTex(this) + "\\text{ gives }" + toTex(result.simplify()) + "$$<br>");
    }

    return result;

};

Binary.prototype.standardize = function(respect) {
    var wrt = respect || "x";
    // if(this.txt === "+" || this.txt == "-") {
    // 	if(!this.left.isVariable(wrt) && this.right.isVariable(wrt)) {
    // 		var temp = this.left.standardize();
    // 		this.left = this.right.standardize();
    // 		this.right = temp;
    // 	}
    // }



    if(this.txt === "*" || this.txt === "+") {



	if(this.left.isVariable(wrt) && !this.right.isVariable(wrt)) {
	    var temp = this.left.standardize();
	    this.left = this.right.standardize();
	    this.right = temp;
	}
    }

    return this;
}
/*

  tree:
  +
  / \
  1   +
  / \
  0   x

  Start at the +
  left = left.simplify()
  (1).simplify() = 1
  right = right.simplify()
  left = 0
  right = x
  return x
  1+x

*/
Binary.prototype.simplify = function(respect) {



    var wrt = respect || "x";

    var cur = (eqn(this).toString());


    var left = this.left.simplify();

    var right = this.right.simplify();

    var result = this;

    result.left = left;
    result.right = right;

    if(!this.isVariable(wrt)) {

	var ans = this.evaluate();
	if(ans < 0) {

	    return new Unary("-", new Operand((-ans).toString()));
	} else {
	    return new Operand(ans.toString());
	}
    }

    if(this.txt === "+") {
	if(left.value === 0){
	    result = right;
	} else if(right.value === 0) {
	    result = left;
	}
    }

    if(this.txt === "-") {

	if(left.value === 0) {
	    result = new Unary("-", right);
	} else if(right.value === 0) {
	    result = left;
	}
    }


    else if(this.txt === "*") {
	if(this.left.value === 0 || this.right.value === 0) {

	    result = new Operand("0");
	}

	if(left.value === 1) {

	    result = right;
	} if(right.value === 1) {

	    result = left;
	}

    }

    else if(this.txt === "/") {
	if(this.right.value === 1) {
	    result = left;
	}
    }

    else if(this.txt === "^") {
	if(this.right.value === 1) {
	    result = left;
	} else if(this.right.value === 0) {
	    result = new Operand("1");
	}

	if(this.left.value === 1) {
	    result = new Operand("1");
	}

	if(this.left.value === 0) {
	    result = new Operand("0");
	}
    }


    return result;

};


Binary.prototype.compile = function() {
	if(this.txt === "^") {
		return "Math.pow(" + this.left.compile() + "," + this.right.compile() + ")";
	} else {
		return "(" + this.left.compile() + ")" + this.txt + "(" + this.right.compile() + ")";
	}
}
function Operand(token) {


	if(typeof token == "number") {
		this.variable = false;
		this.value = token;

		this.txt = token.toString();

	} else {

		if (typeof token == "string") {

			token = tokenize(token)[0];
		}


		if (token.type == 0) {
			this.variable = true;
			this.value = null;
		} else if(token.type == 5){
			this.variable = false;
			if (token.txt == "e") {
				this.value = Math.E;
			} else if (token.txt == "pi") {
				this.value = Math.PI;
			} else {
				this.value = parseFloat(token.txt, 10);
			}
		}
		this.txt = token.txt;
	}


}
Operand.prototype.isVariable = function(wrt) {
	return (this.variable && this.txt == wrt);
};


Operand.prototype.toString = function() {
	return this.txt;
};
Operand.prototype.evaluate = function(variables) {
	if(this.variable) {
		var value = variables[this.txt];
		if(typeof value == "number") {
			return value;
		}else{
			return tree(value).evaluate(variables);
		}
	}
	return this.value;
};
Operand.prototype.differentiate = function(respect, show) {

	var show = show || false;

	var wrt = respect || "x";
	var result;
	if(this.variable && this.txt == wrt) {
		result = new Operand("1");
	} else {
		result =  new Operand("0");
	}


	if(show) {
		resultsDiv.innerHTML += ("$$\\text{Differentiating }" + toTex(this) + "\\text{ gives }" + toTex(result.simplify()) + "$$<br>");
	}
	return result;

};

Operand.prototype.standardize = function() {
	return this;
};

Operand.prototype.simplify = function() {
	return this;
};

Operand.prototype.compile = function() {
	return this.toString();
}/**
 * @constructor
 *
 * @param {String|Tree} expression The equation in string form or tree form
 */
function Equation(expression) {
	this.tree = null;
	if (typeof expression == "string") {
		this.tree = toTree(shunt(expression));
	} else if (expression instanceof Binary || expression instanceof Unary || expression instanceof Operand) {
		this.tree = expression;
	}
}

/**
 * This is the smallest value that things should be
*/
Equation.prototype.epsilon = 1e-10;

/**
 * Converts the tree into infix notation
 *
 * @returns {String} The infix string, sans unnecessary parens
 */
Equation.prototype.toString = function() {
	return toInfix(this.tree);
};

/**
 * Displays an equation on the screen
 *
 */
Equation.prototype.display = function() {
	document.body.innerHTML = "";

	document.body.innerHTML += ("$$" + toTex(this.tree) + "$$" + "<br>");
	MathJax.Hub.Queue([ "Typeset", MathJax.Hub ]);
};

/**
 * Differentiates the tree
 *
 * @returns {Equation} The differentiated equation
 */
Equation.prototype.differentiate = function(wrt, show) {

	var show = show || false;

	return new Equation(this.tree.differentiate(wrt, show));
};

/**
 * Evaluates a tree
 *
 * @param variables The variables in object form, like {"x": xValue}
 * @returns {Number} The evaluated tree
 */
Equation.prototype.evaluate = function() {
	var vars = Array.prototype.slice.call(arguments);

	var variables = {};

	if(vars.length % 2 !== 0) {
		throw new Error("Mismatched variables and values");
	} else {
		for(var i = 0; i < vars.length; i += 2) {
			if(typeof vars[i] !== "string") {
				throw new Error("Variable name must be string");
			} else {
				variables[vars[i]] = (typeof vars[i + 1] === "string") ? new Equation(vars[i + 1]).evaluate() : vars[i + 1];
			}
		}
	}

	return this.tree.evaluate(variables);
};

Equation.prototype.equals = function(second) {
    return this.toString() == second.toString();
}

Equation.prototype.compile = function() {
	return new Function("x", "return " + this.tree.compile());
}

pi = Math.PI;
 Equation.prototype.guess = function(lower, upper, respect, subintervals) {

	var wrt = respect || "x";

	var size = (upper - lower) / (subintervals || 100);

	var signChanges = [];
	var slopeChanges = [];

	var lastSign = NaN, lastSlope = NaN, currentSign = NaN, currentSlope = NaN;
	var derivative = this.differentiate(wrt);
	for (var i = lower; i <= upper; i += size) {
		currentSign = sign(this.evaluate(wrt, i));
		var currentSlope = sign(derivative.evaluate(wrt, i));


		if(currentSign === -lastSign || currentSign === 0) {
			signChanges.push({
				lower: i - size,
				upper: i,
				value: (i - size/2)
			});
		}

		if(currentSlope === -lastSlope || currentSlope === 0) {
			slopeChanges.push(i);
		}


		lastSlope = currentSlope;
		lastSign = currentSign;



	}

	slopeChanges.unshift(lower);
	slopeChanges.push(upper);




	return {
		zeroes: signChanges,
		criticals: slopeChanges
	};

};
/**
 * This applies Newton's method for finding zeroes
 *
 * @param lower {Number} The lower bound, currently useless
 * @param upper {Number} The upper bound, currently useless
 * @param guess {Number} The guess for the zero of the function
 * @param tolerance {Number} [epsilon] The smallest value used in seeing whether
 *  an answer is acceptable
 * @returns {Object.<Number, boolean, Number>} The zero found, whether it was
 * found to tolerance, and the amount it differs from zero
 */

Equation.prototype.zero = function(lower, upper, guess, respect, exists, tolerance) {
	var wrt = respect || "x";

	var accuracy = tolerance || this.epsilon;
	var maxIterations = 100;
	var solution = false;
	var error = Infinity;
	if(typeof guess === "undefined") {
		guess = (lower + upper) / 2;
	} else {
		if(guess < lower || guess > upper) {
			throw new Error("Initial guess must be between lower and upper bounds");
		}
	}
	var x0 = guess;
	var x1 = x0;
	var deriv = this.differentiate(wrt || "x");

	for ( var i = 0; i < maxIterations; i++) {
		var y = this.evaluate(wrt, x0);
		var dy = deriv.evaluate(wrt, x0);

		x1 = x0 - y / dy;


		if (isNaN(x1)) {
			return NaN;
		}


		error = Math.abs(x0 - x1) / Math.abs(x1);

		if (error < accuracy || Math.abs(x0 - x1) < accuracy) {

			solution = true;
			console.log(i);
			break;
		}

		x0 = x1;

	}

	if(exists && !solution) {
		var soln = this.bisection(lower, upper, wrt, tolerance);
		return {
			"solution" : soln,
			"tolerance" : true,
			"error" : this.evaluate(wrt, soln)
		};
	}

	return {
		"solution" : x1,
		"tolerance" : solution,
		"error" : this.evaluate(wrt, x1)
	};

};

/**
 * Finds a min or max on the interval. Splits it up into n subintervals
 * checks if there is a derivative sign change on the interval, uses those as guesses
 * @param lower {Number} The lower bound of the min or max
 * @param upper {Number} The upper bound of the min or max
 * @param subintervals {Number} The number of subintervals
 * @returns {Array} The minimums and maximums along the interval
 */
Equation.prototype.optimize = function(lower, upper, subintervals, respect) {

	var wrt = respect || "x";

	var n = subintervals || 100;

	var size = (upper - lower) / n;

	var df = this.differentiate(wrt || "x");
	var yPrime = NaN;
	var lastYPrime = NaN;
	var lastY = NaN;
	var sign = function(x) {
		return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
	};
	var spots = [];

	for ( var x = lower; x < upper; x += size) {
		yPrime = df.evaluate({
			"x" : x
		});
		if (sign(yPrime) == -sign(lastYPrime)) {
			spots.push(x);
		}

		y = this.evaluate(wrt, x);




		lastYPrime = yPrime;
		lastY = y;

	}

	spots = spots.map(function(x) {
		var zero = df.zero(x - size, x + size, x);

		if (zero.tolerance) {
			return zero.solution;
		} else if (x < this.epsilon || zero.solution < this.epsilon) {
			return 0;
		}
	});
	if (Math.abs(df.evaluate({
		"x" : upper
	})) < this.epsilon) {
		spots.push(upper);
	}

	if (Math.abs(df.evaluate({
		"x" : lower
	})) < this.epsilon) {
		spots.unshift(lower);
	}
	return spots.filter(function(elem, pos) {
		return spots.indexOf(elem) == pos;
	});

};

/**
 * Solves the intersection between two equations.
 * Applies Newton's method on f(x)-g(x) = 0
 *
 * @param curve {Equation} The second curve
 * @param lower {Number} The lower bound
 * @param upper {Number} The upper bound
 * @param guess {Number} The guess of where the intersection is
 * @param tolerance {Number} How accurate the x value should be
 * @returns {Object.<Number, boolean, Number>} The solution
 */
Equation.prototype.solve = function(curve, lower, upper, guess, tolerance) {
	var toSolve = new Equation(new Binary("-", this.tree, curve.tree));
	return toSolve.zero(lower, upper, guess, tolerance || this.epsilon);
};

/**
 * Return the intervals of increasing and decreasing
 *
 * @param lower The lower bound
 * @param upper The upper bound
 * @param subintervals The number of subintervals
 * @returns {Array} The intervals of increasing and decreasing
 */
Equation.prototype.criticals = function(lower, upper, respect, subintervals) {
	var wrt = respect || "x";
	var criticals = this.solveZeroes(lower, upper, respect, subintervals);
	var criticalIntervals = [];

	if (criticals.length === 0) {
		console.log((lower + (lower + upper)/(subintervals || 100)));
		return [{
			"lower" : lower,
			"upper" : upper,
			"sign" : sign(this.differentiate(wrt || "x").evaluate({
				"x" : (lower + (lower + upper)/(subintervals || 100))
			}))
		}];


	}
	if (Math.abs(criticals[0] - lower) > this.epsilon) {
		criticals.unshift(lower);
	}

	if (Math.abs(criticals[criticals.length - 1] - upper) > this.epsilon) {
		criticals.push(upper);
	}

	var numIntervals = 0;
	for ( var i = 0; i < criticals.length - 1; i++) {
		var sgn = sign(this.differentiate(wrt || "x").evaluate(wrt , (criticals[i] + criticals[i + 1]) / 2));
		var prevSign = null;
		if (numIntervals.length > 0) {
			prevSign = criticalIntervals[numIntervals - 1];
		}
		if (prevSign == sgn) {
			criticalIntervals[numIntervals - 1].upper = criticals[i + 1];
		} else {
			criticalIntervals.push({
				"lower" : criticals[i],
				"upper" : criticals[i + 1],
				"sign" : sgn
			});
			numIntervals++;
		}

	}

	return criticalIntervals;
};

Equation.prototype.bisection = function(x1, x2, respect, tolerance) {

	var wrt = respect || "x";
	var tolerance = tolerance || this.epsilon;



	for(var i = 0; i < 100; i++) {

		var x3 = (x1 + x2)/2;
		var fx1 = this.evaluate(wrt, x1);
		var fx2 = this.evaluate(wrt, x2);
		var fx3 = this.evaluate(wrt, x3);


		if(fx3 === 0 || (x2 - x1)/2 < tolerance) {
			return x3;
		}else {
			if(fx1 * fx3 < 0) {
				x2 = x3;
			}else {
				x1 = x3;
			}
		}
	}
};

Equation.prototype.solveZeroes = function(lower, upper, respect, subintervals, tolerance) {



	var wrt = respect || "x";
	var tolerance = tolerance || this.epsilon;
	var subintervals = subintervals || 100;

	var guesses = this.guess(lower, upper, wrt, subintervals);

	var zeroes = guesses.zeroes;
	var criticals = guesses.criticals;

	var solutions = [];

	for(var i = 0; i < zeroes.length; i++) {
		var guess = zeroes[i];
		solutions.push(this.zero(guess.lower, guess.upper, guess.value, wrt, true, tolerance));
	}

	for(var i = 0; i < criticals.length - 1; i++) {
		var current = criticals[i];
		var next = criticals[i + 1];

		solutions.push(this.zero(current, next, (current + next) / 2, wrt, false, tolerance));
	}

	var rounded = solutions.map(function(x) {

		var soln = x.solution;
		if(x.tolerance) {

			if(Math.abs(soln) < 1e-9) {
				soln = 0;
			}
			return soln;

		}


	});


	return rounded.filter(function(element, position) {
		return (rounded.indexOf(element) == position && typeof element !== "undefined" && element >= lower && element <= upper);

	});
}



Equation.prototype.Taylor = function(order, centerTxt, respect) {

	var factorials = [
			1,
			1,
			2,
			6,
			24,
			120,
			720,
			5040,
			40320,
			362880,
			3628800,
			39916800,
			479001600,
			6227020800,
			87178291200,
			1307674368000,
			20922789888000,
			355687428096000,
			6402373705728000,
			121645100408832000,
			2432902008176640000,
			51090942171709440000];



	var wrt = respect || "x";
	var center = new Equation(centerTxt).evaluate() || 0;

	if(order > 21) {
		throw new Error("Order must be less than 22")
	}
	var lastDerivative = this;
	var coefficients = [];


	for(var i = 0; i <= order; i++) {
		var slope = lastDerivative.evaluate(wrt, center);
		if(isNaN(slope) || !isFinite(slope)) {
			throw new Error("Derivative does not exist");
		}
		coefficients.push(Math.round(slope * 1e9) / 1e9);
		lastDerivative = simplify(lastDerivative.differentiate(wrt));
	}


	if(center === 0) {
		var x = "x";
	} else if(center < 0) {
		var x = "(x+(" + centerTxt + "))";
	} else {
		var x= "(x - (" + centerTxt + "))";
	}

	var series = new Operand(coefficients[0]);



	for(var i = 1; i < coefficients.length; i++) {
		var frac = new Fraction(coefficients[i], factorials[i]);
		var str = Math.abs(frac.numerator) + x + "^" + i + "/" + frac.denominator;

		if(frac.numerator > 0) {
			series = new Binary("+", series, tree(str));
		} else if(frac.numerator < 0){
			series = new Binary("-", series, tree(str));
		}

	}

	return simplify(new Equation(series));





}

Equation.prototype.integrate = function(lower, upper, respect, subintervals) {

	var subintervals = subintervals || 100000;
	var size = (upper - lower) / subintervals;
	var wrt = respect || "x";

	var sum = 0;

	for(var i = lower; i < upper; i += size) {
		var left = this.evaluate(wrt, i);
		var right = this.evaluate(wrt, i + size);

		sum += ((left + right) / 2) * size;
	}

	return sum;
}
Equation.prototype.standardize = function() {
	this.tree = this.tree.standardize();
	return this;
}

Equation.prototype.simplify = function() {g
	this.tree = this.tree.simplify();
}

var resultsDiv = document.getElementById("results");
function tex(str) {
	return toTex(simplify(eqn(str)).tree);
};

function texTree(tree) {
	return tex(displayTree(tree));
}

function texEqn(eqn) {
	return toTex(eqn.tree);
}
function stringifyPostfix(expression) {
	var str = "";
	var a = shunt(expression);
	for (var i = 0; i < a.length; i++) {
		str += a[i].txt + " ";
	}
	return str;
}
function stringy(arr) {
	var str = "";
	for (var i = 0; i < arr.length; i++) {
		str += arr[i].txt + " ";
	}
	return str;
}
function evaluateFunction(expression, variables) {
	return Math.round(tree(expression).evaluate(variables) * 1e10) / 1e10;
}
function differentiateFunction(expression, wrt, show) {

	var show = show || false;
	resultsDiv.innerHTML = "";

	var result = toTex(simplify(new Equation(expression).differentiate(wrt, show)).tree);

	resultsDiv.innerHTML += ("$$\\frac{d}{dx}\\left(" + toTex(tree(expression))
			+ "\\right)=" + result + "$$" + "<br>");
	MathJax.Hub.Queue([ "Typeset", MathJax.Hub ]);

}
function differentiateFunctionNoSimplify(expression, wrt, show) {

	var show = show || false;

	var result = toTex(toTree(shunt(expression)).differentiate(wrt, show));
	resultsDiv.innerHTML = "";
	resultsDiv.innerHTML += ("$$\\frac{d}{dx}\\left(" + toTex(tree(expression))
			+ "\\right)=" + result + "$$" + "<br>");
	MathJax.Hub.Queue([ "Typeset", MathJax.Hub ]);
}
function simplifyExpression(expression) {
	return simplify(toTree(shunt(expression)));
}
function tree(expression) {
	return toTree(shunt(expression));
}
function displayTree(tree) {
	return new Equation(tree).toString();
}

function evaluateTree(tree, variables) {

	if (tree instanceof Operand) {
		return tree.value;
	}
	if (tree.leftOperand !== undefined) {
		return tree.evaluate();

	} else {

		return tree.evaluate();
	}
}

function unitTest() {
	var expression = new Expression("1/2");

	console.log(displayTree(expression.tree.makeCommutative()));
}
function solve(first, second, guess) {
	return new Equation(first).solve(new Equation(second), -10, 10, guess);
}

function sign(x) {
	return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

function eqn(str) {
	return new Equation(str);
}

Math.pow_ = Math.pow;

// redefine the method
Math.pow = function(_base, _exponent) {
	if (_base < 0) {
		if (Math.abs(_exponent) < 1) {
			// we're calculating nth root of _base, where n === 1/_exponent
			if (1 / _exponent % 2 === 0) {
				// nth root of a negative number is imaginary when n is even, we
				// could return
				// a string like "123i" but this would completely mess up
				// further computation
				return NaN;
			}
			// nth root of a negative number when n is odd
			return -Math.pow_(Math.abs(_base), _exponent);
		}
	} /* else if _base >=0 */
	// run the original method, nothing will go wrong
	return Math.pow_(_base, _exponent);
};

// Thanks to @o.v. for providing this code at
// http://stackoverflow.com/a/12813002/2027567

function integrate(expression, lower, upper, wrt) {
	resultsDiv.innerHTML = "$$\\int_"
			+ lower
			+ "^"
			+ upper
			+ "\\left("
			+ tex(expression)
			+ "\\right)"
			+ "dx"
			+ "="
			+ Math
					.round(eqn(expression)
							.integrate(lower, upper, (wrt || "x")) * 1e5) / 1e5
			+ "$$" + "<br>";

	MathJax.Hub.Queue([ "Typeset", MathJax.Hub ]);

}
function taylor(expression, order, center, respect) {

	var gcd = function(a, b) {
		if (!b) {
			return a;
		}

		return gcd(b, a % b);
	};


	var texString = "$$"

	var wrt = respect || "x";
	var coefficients = eqn(expression).Taylor(order, center, wrt);

	for (var i = 0; i < coefficients.length; i++) {
		var coefficient = Math.round(coefficients[i] * 1e7) / 1e7;
		var denominator = factorials[i];
		if (center == 0) {
			x = "x";
		} else if (center > 0) {
			x = "(x-" + center + ")";
		} else {
			x = "(x+" + -center + ")";
		}

		if (coefficient % 1 === 0) {
			var g = gcd(coefficient, denominator);

			coefficient /= Math.abs(g);
			denominator /= Math.abs(g);

			if (coefficient !== 0) {
				if (Math.abs(coefficient) === 1) {
					if (coefficient > 0) {
						texString += "+"
								+ ((tex(x + "^" + i + "/" + denominator)));
					} else {
						texString += "-"
								+ ((tex(x + "^" + i + "/" + denominator)));

					}
				} else {
					if (coefficient > 0) {
						texString += "+"
								+ ((tex(coefficient + x + "^" + i + "/"
										+ denominator)));
					} else {
						texString += "-"
								+ ((tex(-coefficient + x + "^" + i + "/"
										+ denominator)));

					}
				}
			}
		} else {

			if (new Fraction(coefficient, denominator).denominator > 1e5) {
				if (coefficient > 0) {
					texString += "+"
							+ ((tex(coefficient + x + "^" + i + "/"
									+ denominator)));

				} else {
					texString += "-"
							+ ((tex(-coefficient + x + "^" + i + "/"
									+ denominator)));

				}
			} else {
				var fraction = new Fraction(coefficient, denominator);
				coefficient = fraction.numerator;
				denominator = fraction.denominator;
				if (coefficient > 0) {
					texString += "+"
							+ ((tex(coefficient + x + "^" + i + "/"
									+ denominator)));

				} else {
					texString += "-"
							+ ((tex(-coefficient + x + "^" + i + "/"
									+ denominator)));

				}
			}

		}
	}

	texString = texString.substring(3);
	texString = "$$" + texString;
	texString += "$$";

	resultsDiv.innerHTML = texString;
	MathJax.Hub.Queue([ "Typeset", MathJax.Hub ]);

}

function getInfo(expression, lower, upper, respect, subintervals, tolerance) {

	var subintervals = subintervals || 100;
	var wrt = respect || "x";
	var tolerance = tolerance || Equation.prototype.epsilon;

	lower = new Equation(lower).evaluate();
	upper = new Equation(upper).evaluate();

	var fn = new Equation(expression);

	var zeroes = new Equation(expression).solveZeroes(lower, upper, wrt,
			subintervals, tolerance);

	resultsDiv.innerHTML = "";
	resultsDiv.innerHTML += "<div style = 'font-size: 150%'>$y=" + texEqn(fn)
			+ "$</div><br><br>";

	zeroes = zeroes.map(function(x) {
		return Math.round(x * 1e5) / 1e5;
	});

	zeroes = zeroes.filter(function(element, position) {
		return zeroes.indexOf(element) === position;
	});

	resultsDiv.innerHTML += "<div style = 'font-size: 125%'>$\\text {Zeroes: } $</div><br>"
	for (var i = 0; i < zeroes.length; i++) {
		resultsDiv.innerHTML += "$" + wrt + "=" + zeroes[i] + "$<br>"
	}

	var firstDerivative = simplify(fn.differentiate(wrt));

	var criticals = firstDerivative.solveZeroes(lower, upper, wrt,
			subintervals, tolerance);

	resultsDiv.innerHTML += "<br><br><div style = 'font-size: 150%'>$\\frac{dy}{dx} = "
			+ texEqn(firstDerivative) + "$</div><br><br>";

	criticals = criticals.map(function(x) {
		return Math.round(x * 1e5) / 1e5;
	});

	criticals = criticals.filter(function(element, position) {
		return criticals.indexOf(element) === position;
	});

	resultsDiv.innerHTML += "<div style = 'font-size: 125%'>$\\text {Critical Points: } $</div><br>"
	for (var i = 0; i < criticals.length; i++) {
		resultsDiv.innerHTML += "$" + wrt + "=" + criticals[i] + "$<br>"
	}

	criticals.unshift(Math.round(lower * 1e5) / 1e5);
	criticals.push(Math.round(upper * 1e5) / 1e5);

	criticals = criticals.filter(function(element, position) {
		return criticals.indexOf(element) === position;
	});

	var criticalIntervals = [];

	var numIntervals = 0;

	for (var i = 0; i < criticals.length - 1; i++) {

		var sgn = sign(firstDerivative.evaluate(wrt,
				(criticals[i] + criticals[i + 1]) / 2));

		var prevSign = null;
		if (numIntervals > 0) {

			prevSign = criticalIntervals[numIntervals - 1].sign;
		}

		if (prevSign == sgn) {
			criticalIntervals[numIntervals - 1].upper = criticals[i + 1];
		} else {
			criticalIntervals.push({
				"lower" : criticals[i],
				"upper" : criticals[i + 1],
				"sign" : sgn
			});

			numIntervals++;

		}

	}

	var mins = [];
	var maxes = [];

	for (var i = 0; i < criticalIntervals.length; i++) {

		if (i === 0) {
			if (criticalIntervals[0].sign === -1) {
				maxes.push({
					"x" : criticalIntervals[i].upper,
					"y" : Math.round(fn.evaluate(wrt,
							criticalIntervals[i].upper) * 1e5) / 1e5,
					"type" : "local"

				});

				mins.push({
					"x" : criticalIntervals[i].lower,
					"y" : Math.round(fn.evaluate(wrt,
							criticalIntervals[i].lower) * 1e5) / 1e5,
					"type" : "local"
				});

			} else {
				mins.push({
					"x" : criticalIntervals[i].upper,
					"y" : Math.round(fn.evaluate(wrt,
							criticalIntervals[i].upper) * 1e5) / 1e5,
					"type" : "local"
				});

				maxes.push({
					"x" : criticalIntervals[i].lower,
					"y" : Math.round(fn.evaluate(wrt,
							criticalIntervals[i].lower) * 1e5) / 1e5,
					"type" : "local"
				});
			}
		} else {
			if (criticalIntervals[i].sign === 1) {

				mins.push({
					"x" : criticalIntervals[i].upper,
					"y" : Math.round(fn.evaluate(wrt,
							criticalIntervals[i].upper) * 1e5) / 1e5,
					"type" : "local"
				});
			} else {
				maxes.push({
					"x" : criticalIntervals[i].upper,
					"y" : Math.round(fn.evaluate(wrt,
							criticalIntervals[i].upper) * 1e5) / 1e5,
					"type" : "local"
				});
			}
		}
	}

	var temp = maxes;
	maxes = mins;
	mins = temp;
	var globalMin = Infinity;

	for (var i = 0; i < mins.length; i++) {
		if (mins[i].y < globalMin) {
			globalMin = mins[i].y;
		}
	}

	for (var i = 0; i < mins.length; i++) {
		if (mins[i].y === globalMin) {
			mins[i].type = "global";
		}
	}

	var globalMax = -Infinity;
	var globalMaxNums = [];
	for (var i = 0; i < maxes.length; i++) {
		if (maxes[i].y >= globalMax) {
			globalMax = maxes[i].y;

		}
	}

	for (var i = 0; i < maxes.length; i++) {
		if (maxes[i].y === globalMax) {
			maxes[i].type = "global";
		}
	}

	resultsDiv.innerHTML += "<br>"
	resultsDiv.innerHTML += "<div style = 'font-size: 125%'>$\\text{Minima: }$</div><br>";
	for (var i = 0; i < mins.length; i++) {

		resultsDiv.innerHTML += "$\\text{"
				+ ((mins[i].type === "local") ? "Local" : "Global")
				+ " minimum at } (" + mins[i].x + "," + mins[i].y + ")$<br>";
	}

	resultsDiv.innerHTML += "<br>"
	resultsDiv.innerHTML += "<div style = 'font-size: 125%'>$\\text{Maxima: }$</div><br>";

	for (var i = 0; i < maxes.length; i++) {

		resultsDiv.innerHTML += "$\\text{"
				+ ((maxes[i].type === "local") ? "Local" : "Global")
				+ " maximum at } (" + maxes[i].x + "," + maxes[i].y + ")$<br>";
	}

	var decIntervals = [];
	var incIntervals = [];

	resultsDiv.innerHTML += "<br><div style = 'font-size: 125%'>$\\text{Intervals of increasing and decreasing: }$</div><br>";

	var incString = "$\\text{Increasing: }$ $\\nobreakspace";
	var decString = "$\\text{Decreasing: }$ $\\nobreakspace";
	var incStringAdd = "";
	var decStringAdd = "";
	for (var i = 0; i < criticalIntervals.length; i++) {
		if (criticalIntervals[i].sign === -1) {
			decStringAdd += "(" + criticalIntervals[i].lower + ","
					+ criticalIntervals[i].upper + ")\\cup";
		} else {
			incStringAdd += "(" + criticalIntervals[i].lower + ","
					+ criticalIntervals[i].upper + ")\\cup";
		}

	}

	resultsDiv.innerHTML += incString + incStringAdd.slice(0, -4) + "$<br>";

	resultsDiv.innerHTML += decString + decStringAdd.slice(0, -4) + "$<br>";

	var secondDerivative = simplify(firstDerivative.differentiate(wrt));

	var inflections = secondDerivative.solveZeroes(lower, upper, wrt,
			subintervals, tolerance);

	resultsDiv.innerHTML += "<br><br><div style = 'font-size: 150%'>$\\frac{d^2y}{dx^2} = "
			+ texEqn(secondDerivative) + "$</div><br><br>";

	inflections = inflections.map(function(x) {
		return Math.round(x * 1e5) / 1e5;
	});

	inflections = inflections.filter(function(element, position) {
		return inflections.indexOf(element) === position;
	});

	resultsDiv.innerHTML += "<div style = 'font-size: 125%'>$\\text {Points of Inflection: } $</div><br>"
	for (var i = 0; i < inflections.length; i++) {
		resultsDiv.innerHTML += "$" + wrt + "=" + inflections[i] + "$<br>"
	}
	resultsDiv.innerHTML += "<br>";

	inflections.unshift(Math.round(lower * 1e5) / 1e5);
	inflections.push(Math.round(upper * 1e5) / 1e5);

	inflections = inflections.filter(function(element, position) {
		return inflections.indexOf(element) === position;
	});

	var inflectionIntervals = [];

	var numIntervals = 0;

	for (var i = 0; i < inflections.length - 1; i++) {

		var sgn = sign(secondDerivative.evaluate(wrt,
				(inflections[i] + inflections[i + 1]) / 2));

		var prevSign = null;
		if (numIntervals > 0) {

			prevSign = inflectionIntervals[numIntervals - 1].sign;
		}

		if (prevSign == sgn) {
			inflectionIntervals[numIntervals - 1].upper = inflections[i + 1];
		} else {
			inflectionIntervals.push({
				"lower" : inflections[i],
				"upper" : inflections[i + 1],
				"sign" : sgn
			});

			numIntervals++;

		}

	}

	var ccupString = "$\\text{Concave Up: }    ";
	var ccdownString = "$\\text{Concave Down: }    "

	for (var i = 0; i < inflectionIntervals.length; i++) {

		if (inflectionIntervals[i].sign === -1) {
			ccdownString += "(" + inflectionIntervals[i].lower + ","
					+ inflectionIntervals[i].upper + ")\\cup";
		} else {
			ccupString += "(" + inflectionIntervals[i].lower + ","
					+ inflectionIntervals[i].upper + ")\\cup";
		}

	}

	resultsDiv.innerHTML += ccupString.slice(0, -4) + "$<br>";
	resultsDiv.innerHTML += ccdownString.slice(0, -4) + "$";

	MathJax.Hub.Queue([ "Typeset", MathJax.Hub ]);

}

function simplify(exp) {
	var last = "";
	var current = exp;

	while (current.toString() !== last) {
		last = current.toString();

		current.tree = (current.tree.simplify());

	}

	return current;
}
