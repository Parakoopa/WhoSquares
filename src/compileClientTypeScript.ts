import * as ts from "typescript";
import * as tsconfig from "tsconfig";

const formatHost: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: path => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
}

// QUELLE: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#writing-an-incremental-program-watcher
// Diese Funktion kompiliert das TypeScript im Client Ordner, damit der Client es verwenden kann und erstellt es neu,
// falls sich was ändert.
// Wenn man etwas exportieren will nutzt man im neuen JavaScript und auch TypeScript "export" vor dem was man
// exportieren will statt module.export = ...
export function compileClientTypeScript() {
    const configPath = ts.findConfigFile(__dirname + "/client/", ts.sys.fileExists, "tsconfig.json");
    if (!configPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }

    // TypeScript can use several different program creation "strategies":
    //  * ts.createEmitAndSemanticDiagnosticsBuilderProgram,
    //  * ts.createSemanticDiagnosticsBuilderProgram
    //  * ts.createAbstractBuilder
    // The first two produce "builder programs". These use an incremental strategy to only re-check and emit files whose
    // contents may have changed, or whose dependencies may have changes which may impact change the result of prior type-check and emit.
    // The last uses an ordinary program which does a full type check after every change.
    // Between `createEmitAndSemanticDiagnosticsBuilderProgram` and `createSemanticDiagnosticsBuilderProgram`, the only difference is emit.
    // For pure type-checking scenarios, or when another tool/process handles emit, using `createSemanticDiagnosticsBuilderProgram` may be more desirable.
    const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

    // Note that there is another overload for `createWatchCompilerHost` that takes a set of root files.
    const host = ts.createWatchCompilerHost(configPath, {}, ts.sys,
        createProgram,
        reportDiagnostic,
        reportWatchStatusChanged,
    );

    // You can technically override any given hook on the host, though you probably don't need to.
    // Note that we're assuming `origCreateProgram` and `origPostProgramCreate` doesn't use `this` at all.
    const origCreateProgram = host.createProgram;
    host.createProgram = (rootNames: ReadonlyArray<string>, options, host, oldProgram) => {
        console.log("** COMPILING CLIENT **");
        return origCreateProgram(rootNames, options, host, oldProgram);
    };

    // `createWatchProgram` creates an initial program, watches files, and updates the program over time.
    ts.createWatchProgram(host);
}

function reportDiagnostic(diagnostic: ts.Diagnostic) {
    console.error("Error", diagnostic.code, ":",
        ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine())
    );
}

/**
 * Prints a diagnostic every time the watch status changes.
 * This is mainly for messages like "Starting compilation" or "Compilation completed".
 */
function reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
    console.info(ts.formatDiagnostic(diagnostic, formatHost));
}