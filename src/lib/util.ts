
//like C's getopt, kind of. don't call it like that though because that function is stupid
//input: args array from command, in the form `"!cmd [args] [-f] [--long-opts  thingy]".split()`
//output: 
//      - an object whose keys are active double-dash flags (long options) (i.e. --flag)
//       and whose corresponding values 
//      - an object whose keys are active single-character flags whose values are all true
//      - an array of the remaining arguments, in order
//single-character flags must be a single letter or digit.
//long-option flags must comprise of letters, digits, dashes, and underscores.
//TODO: support the format --flag=arg format for long-option flags
function getopt(args : string[]) : [object, object, string[]] {
	let fflags : object = {}, flags : object = {}, plainargs : string[] = [];
	let pflag; //nullish iff the prev arg is NOT a long-option flag
	for (let i = 1; i < args.length; i++) {
		if (args[i].match(/-[a-zA-Z0-9]/)) {
			if (pflag) {
				return [{}, {}, []]; //error case
			}
			flags[args[i].charAt(1)] = true;
		} else if (args[i].match(/--[a-zA-Z0-9_][a-zA-Z0-9_\-]*/)) {
			pflag = args[i].substring(2);
		} else if (pflag) {
			fflags[pflag] = args[i];
		} else {
			plainargs.push(args[i]);
		}
	}
	return [fflags, flags, plainargs];
}