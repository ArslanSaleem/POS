const cart={
    items:[],
    addedItems:[],
    totalPrice:0,
    numOfItems:0,
};

function cartReducer(state = cart, action) {
    switch(action.type) {
        case "ADD_ITEM":
            let addedItem = action.payload.item;
            //check if the action id exists in the addedItems
            let existed_item = state.addedItems.find(item=> action.payload.item.Id === item.Id);

            let newNumOfItems = state.numOfItems + 1;
            if(existed_item)
            {
                existed_item.quantity += 1;
                let newPrice = getTotalPrice(state.addedItems);
                return{
                    ...state,
                    totalPrice: newPrice,
                    numOfItems: newNumOfItems
                    }
            }
            else{
                addedItem.quantity = 1;
                //calculating the total
                let newTotal = getTotalPrice([...state.addedItems, addedItem]);

                return{
                    ...state,
                    addedItems: [...state.addedItems, addedItem],
                    totalPrice: newTotal,
                    numOfItems: newNumOfItems
                }
            }

        case "REMOVE_ITEM":
            let itemToRemove= state.addedItems.find(item=> action.payload.Id === item.Id);
            let new_items = state.addedItems.filter(item=>  action.payload.Id !== item.Id);

            //calculating the total
            let updatedNumOfItems = state.numOfItems;
            for (var i=0;i<itemToRemove.quantity;i++){
                updatedNumOfItems = updatedNumOfItems - 1
            }

            let newTotalPrice = getTotalPrice(new_items);

            return{
                ...state,
                addedItems: new_items,
                totalPrice: newTotalPrice,
                numOfItems: updatedNumOfItems
            }

        case "UPDATE_PRICE":
            let itemToUpdate= state.addedItems.find(item=> action.payload.item.Id === item.Id);
            itemToUpdate.price = action.payload.item.price;
            let totalPrice = getTotalPrice(state.addedItems);
            return {
              ...state,
              totalPrice: totalPrice
            }

      case "RESET_CART":
           return {
              ...state,
              items: [],
              addedItems: [],
              totalPrice: 0,
              numOfItems: 0
           }

    }
    return state;

};


function getTotalPrice(items){
      let totalPrice = 0.0;
      for (let i=0;i<items.length;i++){
        totalPrice += items[i].quantity * items[i].price
      }
      return totalPrice
}

export default cartReducer;
