const newItem = $(".addItemForm");
const editItem = $(".editItemForm");
const editName = $(".editItemForm input[name=item_name]");
const editPrice = $(".editItemForm input[name=item_price]");
const editQty = $(".editItemForm input[name=item_qty]");
const searchForm = $(".searchForm");
const itemlist = $("#items_list");
const extraStuff = $(".extraStuff");
const totalBtn = $("#mathBtn");

const baseURL = "http://127.0.0.1:3000";

//adds an item to the list
function addItemToList(item) {
  let newLi = $(
    `<li id="${item.name}"> <p> ${item.name}: $${item.price} x ${item.qty}</p> <button type="button" class="editItem">Edit</button> <button type="button" class="deleteItem">X</button> </li>`
  );
  itemlist.append(newLi);
}

//gets and shows all items in the db
async function listAllItems() {
  res = await axios.get(`${baseURL}/items`);
  for (let i = 0; i < res.data.length; i++) {
    addItemToList(res.data[i]);
  }
}

//deletes an item
itemlist.on("click", ".deleteItem", async (e) => {
  $(".error").remove();
  let item = $(e.target).parent();
  try {
    const res = await axios.delete(`${baseURL}/items/${item.attr("id")}`);
  } catch (e) {
    let newP = $(`<p class='error'>${e.response.data}</p>`);
    $("body").prepend(newP);
    return;
  }
  item.remove();
});

//adds new item
newItem.on("submit", async (event) => {
  event.preventDefault();
  $(".error").remove();
  let name = $(".addItemForm input[name=item_name]");
  let price = $(".addItemForm input[name=item_price]");
  let qty = $(".addItemForm input[name=item_qty]");

  try {
    res = await axios.post(`${baseURL}/items`, {
      name: name.val(),
      price: price.val(),
      qty: qty.val(),
    });
  } catch (e) {
    let newP = $(`<p class='error'>${e.response.data}</p>`);
    $("body").prepend(newP);
    return;
  }

  addItemToList(res.data.added);

  name.val("");
  price.val("");
  qty.val("");
});

//show the edit item form
itemlist.on("click", ".editItem", async (e) => {
  let item = $(e.target).parent();
  $("input[name=original_name]").val(item.attr("id"));

  res = await axios.get(`${baseURL}/items/${item.attr("id")}`);
  editName.attr("placeholder", res.data.name);
  editPrice.attr("placeholder", res.data.price);
  editQty.attr("placeholder", res.data.qty);

  editItem.removeClass("hiddenObj");
  newItem.addClass("hiddenObj");

  item.remove();
});

//edits an item
editItem.on("submit", async (event) => {
  event.preventDefault();
  $(".error").remove();

  let ogName = $("input[name=original_name]").val();

  try {
    res = await axios.patch(`${baseURL}/items/${ogName}`, {
      name: editName.val(),
      price: editPrice.val(),
      qty: editQty.val(),
    });
  } catch (e) {
    let newP = $(`<p class='error'>${e.response.data}</p>`);
    $("body").prepend(newP);
    return;
  }

  editItem.addClass("hiddenObj");
  newItem.removeClass("hiddenObj");
  addItemToList(res.data.updated);

  editName.val("");
  editPrice.val("");
  editQty.val("");
});

//serches for an item
searchForm.on("submit", async (event) => {
  event.preventDefault();
  $(".error").remove();
  let name = $("input[name=q]").val();
  try {
    const res = await axios.get(`${baseURL}/items/${name}`);
    if (res.data.name) {
      showItem(res.data.name, res.data.price, res.data.qty);
    }
  } catch (e) {
    let newP = $(`<p class='error'>${e.response.data}</p>`);
    $("body").prepend(newP);
  }

  $("input[name=q]").val("");
});

function showItem(name, price, qty) {
  let total = price * qty;
  total = total.toFixed(2);
  newdiv = $(`<div class="item">
  <h3>${name}</h3>
  <p>Price:$${price}</p>
  <p>Quantity:${qty}</p>
  <p>Total price for ${name}: $${total}</p>
  </div>`);
  extraStuff.html("");
  extraStuff.append(newdiv);
}

//gets the total price for all items
totalBtn.on("click", async () => {
  res = await axios.get(`${baseURL}/items`);
  let total = 0;
  for (let i = 0; i < res.data.length; i++) {
    total += res.data[i].price * res.data[i].qty;
  }
  total = total.toFixed(2);

  extraStuff.html("");
  extraStuff.append(`<p class='totalPrice'> Total cost: $${total}</p>`);
});

listAllItems();
