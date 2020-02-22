export function addItem(payload) {
    return { type: "ADD_ITEM", payload }
  };

export function removeItem(payload){
  return {
    type:"REMOVE_ITEM", payload
  }
}

export function updatePrice(payload){
  return {
     type:"UPDATE_PRICE", payload
  }
}

export function resetCart(){
  return {
     type:"RESET_CART"
  }
}
