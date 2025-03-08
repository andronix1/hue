let memory = new WebAssembly.Memory({ initial: 2 });
let table = new WebAssembly.Table({ 
    element: "anyfunc",
    initial: 3
});
let buffer = new Uint8Array(memory.buffer);

const pool = {};

function stringFromMemory(size, ptr) {
    let result = '';
    for (let i = 0; i < size; i++) {
        result += String.fromCharCode(buffer[ptr + i]);
    }
    return result;
}

let idsSequence = 0;

function putToPool(element) {
    let newId = idsSequence++;
    pool[newId] = element;
    return newId;
}

function elementGetParent(id) {
    return putToPool(pool[id].parentElement);
}

function createElement(tagSize, tagPtr) {
    let tag = stringFromMemory(tagSize, tagPtr);
    return putToPool(document.createElement(tag));
}

function appendElement(where, what) {
    pool[where].append(pool[what]);
    return where;
}

function queryElement(querySize, queryPtr) {
    let query = stringFromMemory(querySize, queryPtr);
    return putToPool(document.querySelector(query));
}

function deleteElement(id) {
    pool[id].remove();
    delete pool[id];
}

function elementSetId(id, idSize, idPtr) {
    pool[id].id = stringFromMemory(idSize, idPtr); 
    return id;
}

function elementSetOnClick(id, func) {
    pool[id].onclick = (_e) => table.get(func)(id);
    return id;
}

function elementAddClass(id, classSize, classPtr) {
    pool[id].classList.add(stringFromMemory(classSize, classPtr));
    return id;
}

function elementGetTextValue(id) {
    return putToPool(pool[id].value);
}

function elementSetTextContentString(id, strId) {
    pool[id].textContent = pool[strId];
    return id;
}

function elementSetPlaceholder(id, textSize, textPtr) {
    pool[id].placeholder = stringFromMemory(textSize, textPtr);
    return id;
}

function elementSetTextValue(id, textSize, textPtr) {
    pool[id].value = stringFromMemory(textSize, textPtr);
    return id;
}

function elementSetTextContent(id, textSize, textPtr) {
    pool[id].textContent = stringFromMemory(textSize, textPtr);
    return id;
}

async function start(source) {
    let code = await WebAssembly.instantiateStreaming(fetch(source), {
        env: {
            __indirect_function_table: table,
            memory,
            queryElement,
            elementSetId,
            createElement,
            appendElement,
            deleteElement,
            elementAddClass,
            elementSetOnClick,
            elementGetParent,
            elementSetTextContent,
            elementSetTextContentString,
            elementGetTextValue,
            elementSetTextValue,
            elementSetPlaceholder,
        }
    }).then(res => res.instance.exports);
    code.main();
}
