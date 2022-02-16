
//like C's getopt, kind of. don't call it like that though because that function is stupid
//input: args array from command, in the form `"!cmd [args] [-f] [--flags thingy]".split()`
//output: 
//      - an object whose keys are active double-dash flags (i.e. --flag)
//       and whose corresponding values 
//      - an object whose keys are active single-character flags whose values are all true
function getopt(args : string[]) : [object, object] {
	// return [{}, {}];
	let fflags = {}, flags = {};
	for (let i = 1; i < args.length; i++) {

	}
	return [fflags, flags];
}