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

function createItemTr(item){
  const tr = document.createElement('tr');
  const number = document.createElement('td');
  const displayName = document.createElement('td');
  const price = document.createElement('td');
  const count = document.createElement('td');
  const sum = document.createElement('td');

  displayName.innerText = item.displayName;
  displayName.classList.add('text-end');
  price.innerText = `\\${item.price.toLocaleString()}`
  price.classList.add('text-end');
  const inputMinus10 = document.createElement('button');
  const inputMinus1 = document.createElement('button');
  const inputPlus1 = document.createElement('button');
  const inputPlus10 = document.createElement('button');
  const inputCount = document.createElement('input');
  inputMinus10.type = "button";
  inputMinus10.classList.add('btn');
  inputMinus10.classList.add('btn-sm');
  inputMinus10.classList.add('btn-outline-primary');
  inputMinus10.innerText = '-10';
  inputMinus10.tabIndex = "-1";
  inputMinus10.setAttribute('onclick', `changeCount(${item.name},-10)`)
  inputMinus1.type = "button";
  inputMinus1.classList.add('btn');
  inputMinus1.classList.add('btn-sm');
  inputMinus1.classList.add('btn-outline-primary');
  inputMinus1.innerText = '-1';
  inputMinus1.tabIndex = "-1";
  inputMinus1.setAttribute('onclick', `changeCount(${item.name},-1)`)
  inputPlus1.type = "button";
  inputPlus1.classList.add('btn');
  inputPlus1.classList.add('btn-sm');
  inputPlus1.classList.add('btn-outline-primary');
  inputPlus1.innerText = '+1';
  inputPlus1.tabIndex = "-1";
  inputPlus1.setAttribute('onclick', `changeCount(${item.name},1)`)
  inputPlus10.type = "button";
  inputPlus10.classList.add('btn');
  inputPlus10.classList.add('btn-sm');
  inputPlus10.classList.add('btn-outline-primary');
  inputPlus10.innerText = '+10';
  inputPlus10.tabIndex = "-1";
  inputPlus10.setAttribute('onclick', `changeCount(${item.name},10)`)
  inputCount.type = "number";
  inputCount.value = "0";
  inputCount.classList.add("custom-num-width");
  inputCount.classList.add('form-control')
  inputCount.id = item.name;

  number.innerText = "";
  if (item.number >= 1 && item.number <= 6){
    number.innerText = item.number;
    inputCount.classList.add(`gacha-${item.number}`);
  }

  inputCount.setAttribute('onchange',"calc()");
  const countInputInvert = document.getElementById('countInputInvert').checked;
  if (countInputInvert){
    count.appendChild(inputPlus10);
    count.appendChild(inputPlus1);
    count.appendChild(inputCount);
    count.appendChild(inputMinus1);
    count.appendChild(inputMinus10);
  } else {
    count.appendChild(inputMinus10);
    count.appendChild(inputMinus1);
    count.appendChild(inputCount);
    count.appendChild(inputPlus1);
    count.appendChild(inputPlus10);
  }
  const itemPriceSum = document.createElement('span');
  itemPriceSum.id = `${item.name}-Sum`;
  itemPriceSum.innerText = "\\0"
  sum.appendChild(itemPriceSum);
  sum.classList.add('text-end');
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
  const tenin = document.getElementById('tenin').checked;
  const teninSum = document.getElementById('teninSum');
  const allSum = document.getElementById('allSum');
  const autoCopy = document.getElementById('autoCopy').checked;

  const deliverySumValue = delivery ? allSumValue * 0.1 : 0;
  deliverySum.innerText = `\\${deliverySumValue.toLocaleString()}`;
  allSumValue = allSumValue + deliverySumValue;

  if (kabunushi) {
    allSumValue = allSumValue / 2;
    kabunushiSum.innerText = `-¥${allSumValue.toLocaleString()}`;
    kabunushiSum.style = "color:#ea0000;";
  } else {
    kabunushiSum.innerText = "¥0";
    kabunushiSum.style = "color:#000000;";
  }


  if (tenin) {
    allSumValue = allSumValue / 2;
    teninSum.innerText = `-¥${allSumValue.toLocaleString()}`;
    teninSum.style = "color:#ea0000;";
  } else {
    teninSum.innerText = "¥0";
    teninSum.style = "color:#000000;";
  }

  allSum.innerText = `¥${allSumValue.toLocaleString()}`;

  if(autoCopy){
    copySum();
  }
}

function getTenGachaPrice(){
  const kabunushi = document.getElementById('kabunushi').checked;
  const tenin = document.getElementById('tenin').checked;
  const delivery = document.getElementById('delivery').checked;

  let price = tenGachaBasePrice;

  if (delivery){
    price = price * 1.1;
  }

  if (kabunushi){
    price = price / 2;
  }

  if (tenin){
    price = price / 2;
  }
  return price;
}

function gachaPriceChanged(){
  tenGachaButton.innerText = `10連ガチャ値段￥${getTenGachaPrice().toLocaleString()} をコピー`
  calc();
}

function copySum(){
  if(loaded){
    navigator.clipboard.writeText(`${allSumValue}`);
  }
} 

function clearValue(){
  items.forEach((item)=>{
    document.getElementById(item.name).value = 0;
  })
  document.getElementById('delivery').checked = false;
  document.getElementById('kabunushi').checked = false;
  document.getElementById('tenGachaSupportText').value = "";
  document.getElementById('kabunushiSearchBox').value = "";
  calc();
}

function tenGacha(){
  navigator.clipboard.writeText(getTenGachaPrice());
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
  const countInputInvert = document.getElementById('countInputInvert').checked;
  const kabunushiData = document.getElementById('kabunushiDataSource').value;
  const data = { autoCopy, countInputInvert, kabunushiData};
  
  localStorage.setItem('MiGTAKanmiPriceCalcData', JSON.stringify(data));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem('MiGTAKanmiPriceCalcData'));

  if (data) {
    document.getElementById('autoCopy').checked = data.autoCopy ? data.autoCopy : false;
    document.getElementById('countInputInvert').checked = data.countInputInvert ? data.countInputInvert : false;
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
  const counts = countDigits(tenGachaSupportText.value);
  for (let i = 1; i <= 6; i++){
    const items = document.getElementsByClassName(`gacha-${i}`);
    for (let j = 0; j < items.length;j++){
      items[j].value = counts[`${i}`];
    }
  }
  calc();
}

function rebuildItemTable(){
  const itemTableBody = document.getElementById('itemTableBody');
  itemTableBody.innerHTML = "";
  items.forEach( (item)=>{
    itemTableBody.appendChild(createItemTr(item));
  })
}

document.addEventListener('DOMContentLoaded', function() {
  loadData();
  rebuildItemTable();
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
