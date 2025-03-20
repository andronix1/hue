const bindings = {
    loadStr(size, ptr) {
        let result = '';
        for (let i = 0; i < size; i++) {
            result += String.fromCharCode(runtime.memoryBuffer[ptr + i]);
        }
        return result;
    }
};
