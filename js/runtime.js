let _memory = new WebAssembly.Memory({ initial: 4 });

let runtime = {
    PAGE_SIZE: 64 * 1024,
    memory: _memory,
    memoryBuffer: new Uint8Array(_memory.buffer),
    table: new WebAssembly.Table({ initial: 3, element: "anyfunc" })
};

async function start(sourcePath) {
    let wasm = await WebAssembly.instantiateStreaming(fetch(sourcePath), {
        env: {
            __indirect_function_table: runtime.table,
            memory: runtime.memory,
            jsLogStr: log.str,
            jsLogErr: log.err,
            jsLogInt: log.integer,
            jsDomCreateElement: dom.createElement,
            jsDomCreateElement2: dom.createElement,
            jsDomDeleteElement: dom.deleteElement,
            jsDomQueryElement: dom.queryElement,
            jsDomAppendElement: dom.appendElement,
            jsDomSetTextContent: dom.setTextContent,
            jsDomSetTextContentStr: dom.setTextContentStr,
            jsDomGetValueStr: dom.getValueStr,
            jsDomSetListener: dom.setListener,
            jsDomGetParent: dom.getParent,
            jsDomSetAttr: dom.setAttr,
            jsDomAddClass: dom.addClass,
            jsPoolApiLeak: poolApi.leak,
        }
    });
    let code = wasm.instance.exports;
    console.log(code);
    code.main();
}
