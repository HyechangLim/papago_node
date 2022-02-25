const textAreaArray = document.querySelectorAll('textarea');
console.log(textAreaArray);

//변수 네이밍 컨벤션, 도메인과 관련된 용어 정의
//source : 번역할 텍스트와 관련된 명칭
//target : 번역된 결과와 관련된 명칭

const [sourceTextArea, targetTextArea] = textAreaArray;
console.log(sourceTextArea);
console.log(targetTextArea);


const [sourceSelect, targetSelect] = document.querySelectorAll('select');
console.dir(targetSelect);

//번역할 언어의 타입(ko ? en ? ja)
let targetLanguage='en';
//'ko','ja'


//번역할 언어가 바뀔 때마다 값은 변경
targetSelect.addEventListener('change', () =>{
    const selectedIndex=targetSelect.selectedIndex
    console.log(selectedIndex);

    targetLanguage = targetSelect.options[selectedIndex].value;
    console.log(targetLanguage);

})

let debouncer;

sourceTextArea.addEventListener('input', (event) =>{

    if(debouncer){//값이 있으면 true, 없으면 false
        clearTimeout(debouncer);
    }

   debouncer = setTimeout(()=>{
    // 1.어떤 이벤트인가?
    // 2. textarea에 입력한 값은 어떻게 가져올 수 있을까?

    const text = event.target.value; //textArea에 입력받은 값
    if(text){
         //이름이 xml일뿐이지, xml에 국한 되지 않음
    const xhr = new XMLHttpRequest();
    const url = '/detectLangs'; //node 서버의 특정 url주소

    xhr.onreadystatechange = () => {
        if(xhr.readyState == 4 & xhr.status == 200){

            //서버의 응답 결과 확인(respnseText : 응답에 포함된 텍스트)
            //console.log(xhr.responseText);

            const responseData = xhr.responseText;
            console.log(`responseData: ${responseData}`);
            const parsejsonToObject = JSON.parse(JSON.parse(responseData));
            //두번 파싱해야하는이유
            //https://stackoverflow.com/questions/30194562/json-parse-not-working/49460716

            console.log(typeof parsejsonToObject);

            const result = parsejsonToObject['message']['result'];

            //번역된 텍스트를 결과화면에 입력
            targetTextArea.value = result['translatedText'];

            //응답의 헤더(header)확인
        }
    }

    xhr.open("POST", url);

    //서버에 보내는 요청 데이터의 형식에 json 형식임을 명시
    xhr.setRequestHeader("Content-type", "application/json");

    const requestData = { //typeof : object
        text,
        targetLanguage
    }; //객체 만드는 이유 - 두개를 한번에 보낼수없다

    //JSON(javascript object notation)의 타입 - string
    //내장모듈 json활용
    //서버에 보낼 데이터를 문자열화 시킴
    const jasonToString = JSON.stringify(requestData);
    //console.log(typeof jsonTostring); // type : string

    //xhr : XMLHttpRequest
    xhr.send(jasonToString);
    }else{
        console.log('번역할 텍스트를 입력하세요 ');
    }
    
   
    },3000)
    
});