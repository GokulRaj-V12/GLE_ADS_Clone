// data-loader.js — Fetch and cache data.json
let _cache = null;

async function loadData() {
  if (_cache) return _cache;
  const res = await fetch('data.json');
  _cache = await res.json();
  return _cache;
}

function getUrlParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function getMcid() { return getUrlParam('mcid'); }
function getCid()  { return getUrlParam('cid'); }
