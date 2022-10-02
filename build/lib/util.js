function getopt(args) {
    let fflags = {}, flags = {}, plainargs = [];
    let pflag;
    for (let i = 1; i < args.length; i++) {
        if (args[i].match(/^-[a-zA-Z0-9]$/)) {
            if (pflag) {
                return [{}, {}, []];
            }
            flags[args[i].charAt(1)] = true;
        }
        else if (args[i].match(/^--[a-zA-Z0-9_][a-zA-Z0-9_\-]*$/)) {
            pflag = args[i].substring(2);
        }
        else if (pflag) {
            fflags[pflag] = args[i];
            pflag = null;
        }
        else {
            plainargs.push(args[i]);
        }
    }
    return [fflags, flags, plainargs];
}
