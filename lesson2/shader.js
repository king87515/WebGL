    var mvMatrix = mat4.create(); //儲存模型視圖矩陣
    var pMatrix = mat4.create();  //儲存投影矩陣
    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);  //將投影矩陣(projection matrix)寫入相應的內存
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);//模型視圖矩陣(model view matrix)
    }

    function getvertexShader(gl) {
        var str = `attribute vec3 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uMVMatrix; //模型視圖矩陣
    uniform mat4 uPMatrix;  //投影矩陣

	varying vec4 vColor;
    void main(void) {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
		vColor = aVertexColor;
    }
        `;
        //建立
        var shader;
        shader = gl.createShader(gl.VERTEX_SHADER);
        //編譯
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
    function getfragmentShader(gl) {
        var str = `precision mediump float;
		varying vec4 vColor;
    	void main(void) {
        gl_FragColor = vColor;
    }
        `;
        //建立
        var shader;
        shader = gl.createShader(gl.FRAGMENT_SHADER);
        //編譯
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
    var shaderProgram;
    function initShaders() {  //著色器
        var fragmentShader = getfragmentShader(gl);
        var vertexShader = getvertexShader(gl);

        /*添加片段著色器(fragment shader)和頂點著色器(vertex shader)到
        webgl program(二進制碼，可存一個片段與一個頂點著色器)*/
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
        gl.useProgram(shaderProgram);
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

		shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    }

	function bindVertexBuffer(VertexPositionBuffer, VertexColorBuffer){
		if(VertexColorBuffer === undefined)VertexColorBuffer = {numItems:-1};
		if(VertexColorBuffer.numItems != VertexPositionBuffer.numItems){
			VertexColorBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, VertexColorBuffer);
			colors = [];
			for (var i=0; i < VertexPositionBuffer.numItems; i++)colors = colors.concat([1.0, 1.0, 1.0, 1.0]);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
			VertexColorBuffer.itemSize = 4;
			VertexColorBuffer.numItems = VertexPositionBuffer.numItems;
		}
        gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, VertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, VertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        setMatrixUniforms();
	}
