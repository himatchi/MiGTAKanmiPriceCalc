var items = [];

var allSumValue = 0;
var loaded = false;

function isExpiryValid(expiry) {
  // 現在の日時を取得
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonthは0から始まるため、+1する

  // 有効期限を年と月に分解
  const [expiryYear, expiryMonth] = expiry.split('/').map(Number);

  // 有効期限が現在の年月と同じか、それより未来かを判定
  if (expiryYear > currentYear || (expiryYear === currentYear && expiryMonth >= currentMonth)) {
    return true;
  } else {
    return false;
  }
}

function changeCount(target, diff){
  target.value = parseInt(target.value) + diff >= 0 ? parseInt(target.value) + diff : 0;
  calc();
}

function loadItems(){
  // JSONファイルのURL
  const jsonUrl = 'itemList.json';

  // 新しいXMLHttpRequestを作成
  let xhr = new XMLHttpRequest();

  // 同期的なリクエストの設定 (第三引数にfalseを指定)
  xhr.open('GET', jsonUrl, false);

  try {
    // リクエストを送信
    xhr.send();

    // HTTPステータスコードが200（成功）の場合
    if (xhr.status === 200) {
      // レスポンスをJSONとして解析
      items = JSON.parse(xhr.responseText);
    } else {
      // エラーハンドリング
      console.error('Failed to fetch data:', xhr.statusText);
    }
  } catch (err) {
    // ネットワークエラーやリクエスト中止時のエラーハンドリング
    console.error('Request failed:', err);
  }
}

function createItemTr(item){
  const tr = document.createElement('tr');
  const number = document.createElement('td');
  const displayName = document.createElement('td');
  const price = document.createElement('td');
  const count = document.createElement('td');
  const sum = document.createElement('td');
  number.innerText = "";
  if (item.number > 0 && item.number <= 6){
    number.innerText = item.number;
  }
  displayName.value = item.displayName;
  price.value = `\\${item.price.toLocaleString}`
  const inputMinus10 = document.createElement('input');
  const inputMinus1 = document.createElement('input');
  const inputPlus1 = document.createElement('input');
  const inputPlus10 = document.createElement('input');
  const inputCount = document.createElement('input');
  inputMinus10.type = "button";
  inputMinus10.value = "-10";
  inputMinus10.tabIndex = "-1";
  inputMinus10.onclick = `changeCount(${item.name},-10)`;
  inputMinus1.type = "button";
  inputMinus1.value = "-1";
  inputMinus1.tabIndex = "-1";
  inputMinus1.onclick = `changeCount(${item.name},-1)`;
  inputPlus1.type = "button";
  inputPlus1.value = "+1";
  inputPlus1.tabIndex = "-1";
  inputPlus1.onclick = `changeCount(${item.name},+1)`;
  inputPlus10.type = "button";
  inputPlus10.value = "+10";
  inputPlus10.tabIndex = "-1";
  inputPlus10.onclick = `changeCount(${item.name},+10)`;
  inputCount.type = "number";
  inputCount.value = "0";
  inputCount.size = 5;
  inputCount.id = item.name;
  inputCount.onchange = "calc()";
  count.appendChild(inputMinus10);
  count.appendChild(inputMinus1);
  count.appendChild(inputCount);
  count.appendChild(inputPlus1);
  count.appendChild(inputPlus10);
  const itemPriceSum = document.createElement('span');
  itemPriceSum.id = `${item.name}-Sum`;
  itemPriceSum.innerText = "\\0"
  sum.appendChild(itemPriceSum);
  tr.appendChild(number);
  tr.appendChild(displayName);
  tr.appendChild(price);
  tr.appendChild(count);
  tr.appendChild(sum);
  return tr;
}

function calc(){
  allSumValue = 0;
  items.forEach((item)=>{
    const itemCount = parseInt(document.getElementById(item.name).value);
    const itemPrice = item.price;
    const itemSum = document.getElementById(`${item.name}-Sum`);
    itemSum.innerText = `\\${(itemCount * itemPrice).toLocaleString()}`
    allSumValue = allSumValue + (itemCount * itemPrice);
  });
  const delivery = document.getElementById('delivery').checked;
  const deliverySum = document.getElementById('deliverySum');
  const kabunushi = document.getElementById('kabunushi').checked;
  const kabunushiSum = document.getElementById('kabunushiSum');
  const allSum = document.getElementById('allSum');
  const autoCopy = document.getElementById('autoCopy').checked;

  const deliverySumValue = delivery ? allSumValue * 0.1 : 0;
  deliverySum.innerText = `\\${deliverySumValue.toLocaleString()}`;

  if (kabunushi) {
    allSumValue = allSumValue / 2;
    kabunushiSum.innerText = `-¥${allSumValue.toLocaleString()}`;
    kabunushiSum.style = "color:#ea0000;";
  } else {
    kabunushiSum.innerText = "¥0";
    kabunushiSum.style = "color:#000000;";
  }

  allSum.innerText = `¥${allSumValue.toLocaleString()}`;

  if(autoCopy){
    copySum();
  }
}

function kabunushiChanged(){
  const tenGachaButton = document.getElementById('tenGachaButton');
  const kabunushi = document.getElementById('kabunushi').checked;
  if (kabunushi){
    tenGachaButton.value = "10連ガチャ値段￥1,000,000 をコピー"
  } else {
    tenGachaButton.value = "10連ガチャ値段￥2,000,000 をコピー"
  }
  calc();
}

function copySum(){
  if(loaded){
    navigator.clipboard.writeText(`${allSumValue}`);
  }
}

function clearValue(){
  document.getElementById('nyandangoCount').value = 0;
  document.getElementById('mitarashiCount').value = 0;
  document.getElementById('goldYoukanCount').value = 0;
  document.getElementById('taiyakiCount').value = 0;
  document.getElementById('mattyaCount').value = 0;
  document.getElementById('kanmisakeCount').value = 0;
  document.getElementById('moonRabitDaifukuCount').value = 0;
  document.getElementById('konpeitouCount').value = 0;
  document.getElementById('delivery').checked = false;
  document.getElementById('kabunushi').checked = false;
  document.getElementById('tenGachaSupportText').value = "";
  document.getElementById('kabunushiSearchBox').value = "";
  calc();
}

function TenGacha(){
  const kabunushi = document.getElementById('kabunushi').checked;
  if (kabunushi){
    navigator.clipboard.writeText('1000000');
  } else {
    navigator.clipboard.writeText('2000000');
  }
}

function TenGachaDelivery(){
  const kabunushi = document.getElementById('kabunushi').checked;
  if (kabunushi){
    navigator.clipboard.writeText('1100000');
  } else {
    navigator.clipboard.writeText('2200000');
  }
}

function toggleShowKabunushiDataSource() {
  const targetDiv = document.getElementById('kabunushiDataSourceDiv');
  if (targetDiv.hidden == true){
    targetDiv.hidden = false;
  } else {
    targetDiv.hidden = true;
  }
}

function updateKabunushiView() {
  const searchBox = document.getElementById('kabunushiSearchBox');
  const resultTable = document.getElementById('kabunushiTable');
  const dataSource = document.getElementById('kabunushiDataSource');
  const lines = dataSource.value.split('\n');
  let isFound = false;
  resultTable.innerHTML = ''; // 表要素をクリア
  if (!searchBox.value) return;
  lines.forEach(function(line) {
    if (line.includes(searchBox.value)) {
      if (isFound == false) {
        isFound = true;
        const tr = document.createElement('tr');
        const kabunushiNo = document.createElement('td');
        const kabunushiName = document.createElement('td');
        const kabunushiKigen = document.createElement('td');
        const kabunushiValid = document.createElement('td');
        kabunushiNo.innerText = "No";
        kabunushiName.innerText = "名前";
        kabunushiKigen.innerText = "有効期限";
        kabunushiValid.innerText = "有効";
        tr.appendChild(kabunushiNo);
        tr.appendChild(kabunushiName);
        tr.appendChild(kabunushiKigen);
        tr.appendChild(kabunushiValid);
        resultTable.appendChild(tr);
      }
      const tr = document.createElement('tr');
      const kabunushiNo = document.createElement('td');
      const kabunushiName = document.createElement('td');
      const kabunushiKigen = document.createElement('td');
      const kabunushiValid = document.createElement('td');
      const kabunushi = line.trim().split(',');
      if (kabunushi.length < 4) {
        return;  //continueの代わり
      }
      kabunushiNo.innerText = kabunushi[0];
      kabunushiName.innerText = kabunushi[1];
      kabunushiKigen.innerText = kabunushi[3];
      kabunushiValid.innerText = isExpiryValid(kabunushi[3]) ? "○" : "×";
      tr.appendChild(kabunushiNo);
      tr.appendChild(kabunushiName);
      tr.appendChild(kabunushiKigen);
      tr.appendChild(kabunushiValid);
      resultTable.appendChild(tr);
    }
  });
}

function saveData() {
  const autoCopy = document.getElementById('autoCopy').checked;
  const kabunushiData = document.getElementById('kabunushiDataSource').value;
  const data = { autoCopy, kabunushiData};

  localStorage.setItem('MiGTAKanmiPriceCalcData', JSON.stringify(data));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem('MiGTAKanmiPriceCalcData'));

  if (data) {
    document.getElementById('autoCopy').checked = data.autoCopy ? data.autoCopy : false;
    document.getElementById('kabunushiDataSource').value = data.kabunushiData ? data.kabunushiData : "";
  }
}

function countDigits(inputString) {
  // 初期化: 1から6までのキーを持つオブジェクトを作成し、カウントを0に設定
  const counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};

  // 文字列を1文字ずつ調べる
  for (let i = 0; i < inputString.length; i++) {
    const digit = inputString[i];

    // 文字が1から6の範囲内であるかdチェック
    if (digit >= '1' && digit <= '6') {
      // 対応するカウンターを1増やす
      counts[digit]++;
    }
  }
  return counts;
}

function tenGachaSupport() {
  const nyandangoCount = document.getElementById('nyandangoCount');
  const mitarashiCount = document.getElementById('mitarashiCount');
  const goldYoukanCount = document.getElementById('goldYoukanCount');
  const taiyakiCount = document.getElementById('taiyakiCount');
  const mattyaCount = document.getElementById('mattyaCount');
  const kanmisakeCount = document.getElementById('kanmisakeCount');
  const tenGachaSupportText = document.getElementById('tenGachaSupportText');
  const counts = countDigits(tenGachaSupportText.value);
  nyandangoCount.value = counts['1'];
  mitarashiCount.value = counts['2'];
  goldYoukanCount.value = counts['3'];
  taiyakiCount.value = counts['4'];
  mattyaCount.value = counts['5'];
  kanmisakeCount.value = counts['6'];
  calc();
}

document.addEventListener('DOMContentLoaded', function() {
  loadItems();
  const itemTableBody = document.getElementById('itemTableBody');
  items.forEach( (item)=>{
    itemTableBody.appendChild(createItemTr(item));
  })
  loadData()
  calc();
  const inputField = document.getElementById('tenGachaSupportText');
  inputField.addEventListener('input', function (e) {
    // 入力された値が1から6の範囲の数字のみかどうかをチェック
    if (this.value.match(/[^1-6]/g)) {
      // 不適切な文字が含まれている場合は、それらを削除
      this.value = this.value.replace(/[^1-6]/g, '');
    }
  });

  loaded = true;
});