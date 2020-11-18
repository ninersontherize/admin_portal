
const getEnvironment = (requiredVars) => {
    let vars = {};

    requiredVars.map(vr => {
        const envVar = process.env[vr] || undefined;
        if(!envVar) {
            console.log(`${vr} required in enviromemnt.`)
            process.exit(1);
        }
        else {
           vars[vr] = envVar;
        }
    });

    return vars;
}

module.exports = { getEnvironment}