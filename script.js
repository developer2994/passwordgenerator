// ==================================================
// 1. HTML要素の取得
// ==================================================

// パスワード生成エリア
const pwcreate = document.querySelector('.create');
const pwresult = document.querySelector('.result');
const pwcopy = document.querySelector('.copy');
const lengthOption = document.querySelector('.lengthOption');
const wordLength = document.querySelector('.word-count');
const twentyWords = document.querySelector('.twentywords');

// メール本文作成エリア
const copyNameMail = document.querySelector('.submitName');
const createMail = document.querySelector('.Namecreate');
const Mailtext = document.querySelector('.Email-line');
const date = document.querySelector('.date-line');
const MailBtn = document.querySelector('.mail-button');

// howtoページの要素
const showHowto = document.querySelector('#showHowto');
const backApp = document.querySelector('#backApp');


// ==================================================
// 2. パスワードに使用する文字
// ==================================================

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const numbers = '1234567890';
const symbols = '!@#$%&*-_+=';
const allletters = letters + numbers + symbols;


// ==================================================
// 3. 関数
// ==================================================

// 画面を切り替えるための関数
function showPage(pageId) {
  const pages = document.querySelectorAll('.page'); // pageクラスを持つ要素をすべて取得する

  // 取得したすべてのpage要素に対して処理を行う
  pages.forEach(page => {
    page.classList.remove('active'); // いったん全ページからactiveクラスを削除して非表示にする
  });

  // 引数で受け取ったIDのページだけactiveクラスを付けて表示する
  document.getElementById(pageId).classList.add('active');
}

function getSecureRandomIndex(max) {
  const randomArray = new Uint32Array(1);

  crypto.getRandomValues(randomArray);

  return randomArray[0] % max;
}

// パスワードを作成する関数
function generatePassword(length) {
  length = Number(length); // 引数で受け取ったlengthを数値型に変換する

  if (!Number.isInteger(length) || length < 3) {
    window.alert('3文字以上の整数を入力してください');
    wordLength.value = "";
    return "";
  }

  // 作成するパスワードを入れるための空文字を用意する
  let basePassword = '';

  const letterIndex = getSecureRandomIndex(letters.length); // lettersの中からランダムな位置番号を作成する
  basePassword += letters[letterIndex]; // ランダムに選ばれた英字を1文字passwordに追加する

  const numberIndex = getSecureRandomIndex(numbers.length); // numbersの中からランダムな位置番号を作成する
  basePassword += numbers[numberIndex];  // ランダムに選ばれた数字をpasswordに追加する

  const symbolIndex = getSecureRandomIndex(symbols.length);  // symbolsの中からランダムな位置番号を作成する
  basePassword += symbols[symbolIndex]; // ランダムに選ばれた記号をpasswordに追加する

  // 残りの文字数分、英字・数字・記号の中からランダムに追加する
  for (let i = 0; i < length - 3; i++) {
    const randomIndex = Math.floor(Math.random() * allletters.length); // alllettersの中からランダムな位置番号を作成する
    basePassword += allletters[randomIndex]; // ランダムに選ばれた文字をpasswordに追加する
  }

  // 作成したパスワードを1文字ずつ配列にする
  const passwordArray = basePassword.split('');

  for (let i = passwordArray.length -1; i > 0; i--) {
    const randomIndex = getSecureRandomIndex(i + 1);

    const temp = passwordArray[i];
    passwordArray[i] = passwordArray[randomIndex];
    passwordArray[randomIndex] = temp;
  }

  basePassword = passwordArray.join('')

  // 完成したパスワードを呼び出し元に返す
  return basePassword;
}

// 任意の文字数のパスワードを作成する関数
function custom() {
  // 入力された文字数を使ってパスワードを生成する
  const password = generatePassword(wordLength.value);

  // passwordが空文字だった場合は処理を終了する
  // ただし、今のgeneratePassword関数は基本的に空文字を返さないため、この条件はほぼ使われない
  if (password === '') {
    return;
  }

  // 生成したパスワードを画面のinputに表示する
  pwresult.value = password;
}

// 20文字のパスワードを作成する関数
function twenty() {
  // 20文字を指定してパスワードを生成する
  const password = generatePassword(20);

  // passwordが空文字だった場合は処理を終了する
  // ただし、今のgeneratePassword関数は基本的に空文字を返さないため、この条件はほぼ使われない
  if (password === '') {
    return "";
  }

  // 生成したパスワードを画面のinputに表示する
  pwresult.value = password;
}

// コピー処理をまとめた関数
function copyText(text, message) {
  // コピー対象の文字が空の場合
  if (!text) {
    window.alert('コピーする内容がありません');

    // ここで処理を終了する
    return "";
  }

  // Clipboard APIが使える、かつ安全な環境の場合
  if (navigator.clipboard && window.isSecureContext) {
    // Clipboard APIを使って文字をコピーする
    navigator.clipboard.writeText(text)
      // コピーに成功した場合
      .then(() => {
        // 成功メッセージを表示する
        window.alert(message);
      })
      // コピーに失敗した場合
      .catch(() => {
        // 予備のコピー処理を実行する
        fallbackCopy(text, message);
      });

  // Clipboard APIが使えない環境の場合
  } else {
    // 予備のコピー処理を実行する
    fallbackCopy(text, message);
  }
}

// ローカルHTMLでもコピーできるようにする予備のコピー処理
function fallbackCopy(text, message) {
  // 一時的なtextareaを作成する
  const textarea = document.createElement('textarea');

  // textareaの中にコピーしたい文字を入れる
  textarea.value = text;

  // textareaを画面外に固定配置する
  textarea.style.position = 'fixed';

  // textareaを左の画面外に移動する
  textarea.style.left = '-9999px';

  // 作成したtextareaをbodyの中に追加する
  document.body.appendChild(textarea);

  // textareaにフォーカスを当てる
  textarea.focus();

  // textareaの文字を選択状態にする
  textarea.select();

  // 選択中の文字をコピーする
  document.execCommand('copy');

  // コピー後、一時的に作ったtextareaを削除する
  document.body.removeChild(textarea);

  // コピー完了メッセージを表示する
  window.alert(message);
}

// メール本文を作成する関数
function MainMail() {
  // 送信者名が入力されていない場合
  if (!copyNameMail.value) {
    // アラートを表示する
    window.alert('必要情報を入力してください');
    return "";
  }

  // 日付が選択されていない場合
  if (!date.value) {
    // アラートを表示する
    window.alert('必要情報を入力してください');
    return "";
  }

  // 入力された送信者名をNameという変数に入れる
  const Name = copyNameMail.value;

  // 入力された日付をDateオブジェクトに変換する
  const Realdate = new Date(date.value);

  // 月と日を取り出して「月/日」の形にする
  const replaceDate = (Realdate.getMonth() + 1) + '/' + Realdate.getDate();

  // 曜日番号を取得する。日曜が0、月曜が1、土曜が6
  const days = Realdate.getDay();

  // 曜日番号に対応する曜日の文字を配列で用意する
  const weekbox = ['(日)', '(月)', '(火)', '(水)', '(木)', '(金)', '(土)'];

  // 曜日番号を使って、表示用の曜日を取得する
  const showweek = weekbox[days];

  // メール本文をテンプレートリテラルで作成する
  const mailText = `○○株式会社 ご担当者様

いつもお世話になっております。
××株式会社 ${Name}です。

添付のExcelをご参照いただき、福岡拠点VPNに以下のユーザーのご登録をお願いいたします。
${replaceDate}${showweek}までにご対応いただけますと幸いです。

【追加ユーザー】
・
・

【削除ユーザー】
・
・

よろしくお願いいたします。`;

  // 作成したメール本文をtextareaに表示する
  Mailtext.value = mailText;
}


// ==================================================
// 4. イベント処理
// ==================================================

// 「アプリの使用方法」リンクがクリックされたときの処理
showHowto.addEventListener('click', (event) => {
  event.preventDefault(); // aタグの通常動作であるページ移動を止める

  showPage('howto-page'); // 使い方ページを表示する
});

// 「アプリに戻る」リンクがクリックされたときの処理
backApp.addEventListener('click', (event) => {
  event.preventDefault(); // aタグの通常動作であるページ移動を止める

  // アプリ画面を表示する
  showPage('app-page');
});

// パスワード生成ボタンがクリックされたときの処理
pwcreate.addEventListener('click', () => {
  // 任意文字数のラジオボタンが選択されている場合
  if (lengthOption.checked) {
    custom(); // 任意文字数のパスワードを作成する関数を実行する

  // 20文字のラジオボタンが選択されている場合
  } else if (twentyWords.checked) {
    twenty(); // 20文字のパスワードを作成する関数を実行する
  }
});

// 文字数入力ボックスに入力があった瞬間にラジオボタンの切り替える
wordLength.addEventListener('input', () => {
  lengthOption.checked = true;
});

// パスワードコピーボタンがクリックされたときの処理
pwcopy.addEventListener('click', () => {
  // パスワード表示欄の値をコピーする
  copyText(pwresult.value, 'コピーしました!');
});

// メール本文生成ボタンがクリックされたときの処理
createMail.addEventListener('click', () => {
  // メール本文を作成する関数を実行する
  MainMail();
});

// メール本文コピーボタンがクリックされたときの処理
MailBtn.addEventListener('click', () => {
  // メール本文のtextareaに入っている文字をコピーする
  copyText(Mailtext.value, 'メール本文をコピーしました!');
});