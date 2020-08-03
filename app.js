let DataHandler = (() => {
   let dataHolder = {};
   let itemsCount = 0;
   let totalValue = 0;
   let expensesThreshold;
   function createCategoryObject(name, description, type) {
      this.name = name;
      this.description = description;
      this.subcategoriesName = ["general"];
      this.totalValue = 0;
      this.type = type;
      this.subcategoriesData = {}
      this.totalItems = 0;
   }
   dataHolder["savings"] = new createCategoryObject("Savings", "It consists of Savings Data", "Savings");
   dataHolder["investments"] = new createCategoryObject("Investments", "It consists of Investments Data", "Investment");
   dataHolder["expenses"] = new createCategoryObject("Expenses", "It consists of Expenses Data", "Expenses");
   dataHolder["income"] = new createCategoryObject("Income", "It consists of Income Data", "Income");
   dataHolder["savings"].subcategoriesData["general"] = new createSubCategoryObject("General", "Direct under category", "general", "savings")
   dataHolder["investments"].subcategoriesData["general"] = new createSubCategoryObject("General", "Direct under category", "general", "investments")
   dataHolder["expenses"].subcategoriesData["general"] = new createSubCategoryObject("General", "Direct under category", "general", "expenses")
   dataHolder["income"].subcategoriesData["general"] = new createSubCategoryObject("General", "Direct under category", "general", "income")

   function createSubCategoryObject(name, description, type, parentName) {
      createCategoryObject.call(this, name, description, type);
      this.parentName = parentName;
      this.items = [];
   }
   function createItem(subcategory, description, value, id) {
      this.id = id;
      this.description = description;
      this.value = value;
      this.subcategory = subcategory;
      this.date = new Date().toLocaleDateString();
   }
   return {
      getItemsCount() {
         return itemsCount;
      },

      setExpensesThreshold(thresholdValue) {
         expensesThreshold = thresholdValue;
      },

      getExpensesThreshold() {
          return expensesThreshold;
      },

      getDataHolderTotal() {
         return totalValue;
      },

      getDataHolder() {
         return dataHolder;
      },

      increaseItemsCount() {
         itemsCount = itemsCount + 1;
      },

      getCategoryData(category) {
         return dataHolder[category];
      },

      getSavingsData() {
         return dataHolder["savings"];
      },

      getInvestmentsData() {
         return dataHolder["investments"];
      },

      getIncomeData() {
         return dataHolder["income"];
      },

      getExpensesData() {
         return dataHolder["expenses"];
      },
      createItem(subcategory, description, value, id) {
         return new createItem(subcategory, description, value, id)
      },
      insertItemTocategory(category, subCategoryName, itemObject) {
         let categoryObject = dataHolder[category.toLowerCase()]
         let subcategoryObject = categoryObject.subcategoriesData[subCategoryName.toLowerCase()]
         subcategoryObject.items.push(itemObject);
         categoryObject.totalValue = categoryObject.totalValue + itemObject.value;
         categoryObject.totalItems = categoryObject.totalItems + 1;
         subcategoryObject.totalValue = subcategoryObject.totalValue + itemObject.value;
         totalValue = totalValue + itemObject.value;
      },

      addSubCategoryToDataHolder(subcategoryName, description, categoryName) {
         dataHolder[categoryName].subcategoriesData[subcategoryName] =
            new createSubCategoryObject(subcategoryName, description, subcategoryName, categoryName);
         dataHolder[categoryName].subcategoriesName.push(subcategoryName);
      }
   }

})();

let UIHandler = (() => {
   let HTMLStrings = {
      categoryDropDownMenu: 'category-dropdown-menu',
      trackingDropDownText: 'category-button',
      addMoneyInputDescription: 'addMoney-input-description',
      addMoneyInputValue: 'addMoney-input-value',
      addMoneyInputButton: 'addMoney-input-button',
      addMoneyInputTable: 'addMoneyInput-table',
      subcategoryDropDownMenu: 'subcategory-dropdown-menu',
      subcategorytrackingDropDownText: 'subcategory-button',
      subcategorydiv: 'subcategory-div',
      addsubcategorytab: 'add-subcategory-tab',
      categoriesSubcategoriesList: 'addsubcategory-category-subcategory-list',
      addsubcategoryInputButton: 'addsubcategory-input-button',
      addsubcategoryInputName: 'addsubcategory-input-name',
      addsubcategoryInputDescription: 'addsubcategory-input-description',
      addsubcategoryCategoryDropDown: 'addsubcategorypage-category-dropdown-menu',
      addsubcategoryCategoryDropDownButtonText: 'addsubcategory-category-button',
      overviewTab: 'overview-tab',
      overviewPageMainContainer: 'overview-page-maincontainer',
      overviewPageChartContainer: 'overview-page-chartContainer',
      overviewPageHeading: 'overview-page-heading',
      overviewPageRightSideContainer: 'overiew-page-rightsideContainer',
      leftNavigationDiv: 'left-nav-div',
      savingsOverviewPageHeading: 'savings-overview-page-heading',
      savingsOverviewPageMainContainer: 'savings-overview-page-maincontainer',
      savingsOverviewPageChartContainer: 'savings-overview-page-chartContainer',
      savingsOverviewPageRightSideContainer: 'savings-overview-page-rightsideContainer',
      investmentsOverviewPageHeading: 'investments-overview-page-heading',
      investmentsOverviewPageMainContainer: 'investments-overview-page-maincontainer',
      investmentsOverviewPageChartContainer: 'investments-overview-page-chartContainer',
      investmentsOverviewPageRightSideContainer: 'investments-overview-page-rightsideContainer',
      incomeOverviewPageHeading: 'income-overview-page-heading',
      incomeOverviewPageMainContainer: 'income-overview-page-maincontainer',
      incomeOverviewPageChartContainer: 'income-overview-page-chartContainer',
      incomeOverviewPageRightSideContainer: 'income-overview-page-rightsideContainer',
      expensesOverviewPageHeading: 'expenses-overview-page-heading',
      expensesOverviewPageMainContainer: 'expenses-overview-page-maincontainer',
      expensesOverviewPageChartContainer: 'expenses-overview-page-chartContainer',
      expensesOverviewPageRightSideContainer: 'expenses-overview-page-rightsideContainer',
      expensesThresholdAnchorLink:'expenses-threshold-anchorLink',
      expensesThresholdInputValue:'expenses-threshold-input-value',
      expensesThresholdDisplay:'expenses-threshold-display',
      expensesThresholdValueButton:'expenses-threshold-input-button',
      addMoneyMainInputRow:'addMoney-input-main-row',
      addMoneyTableView:'addMoney-input-table',
      trackMoneyHeading:'trackmoney-heading'

   }
   return {
      capitalizeFirstLetter(str) {
         return str.charAt(0).toUpperCase() + str.slice(1);
      },

      numberFormat(number) {
         return Intl.NumberFormat('en-IN').format(number);
      },
      getHTMLStrings() {
         return HTMLStrings;
      },

      displaySubcategoriesOnUI() {
         let dataHolder = DataHandler.getDataHolder();
         let categories = Object.keys(dataHolder);
         for (categoryName in categories) {
            let html = '<div class = "row" ' + 'name =' + this.capitalizeFirstLetter(categories[categoryName]) + '> <h5><b>' + this.capitalizeFirstLetter(categories[categoryName]) + '</b></h5></div>';
            let tableHtml = '<table class="table"><thead><tr><th scope="col">Subcategory Name</th><th scope="col">Description</th></tr></thead>'
            let tabelBody = '<tbody name = ' + this.capitalizeFirstLetter(categories[categoryName]) + '-tbody>'
            let tableData = "";
            let categoryObject = dataHolder[categories[categoryName]]
            for (subcategoryNameIndex in categoryObject.subcategoriesName) {
               let subcatName = categoryObject.subcategoriesName[subcategoryNameIndex];
               let subcategoryObject = categoryObject.subcategoriesData[subcatName];
               console.log(subcategoryObject);
               tableData = tableData + this.getRowForSubCategoriesTable(subcategoryObject.name, subcategoryObject.description);
            }
            tableData = tableData + '</tbody></table></div>'
            let finalHtml = html + tableHtml + tabelBody + tableData;
            document.getElementsByName(HTMLStrings.categoriesSubcategoriesList)[0].insertAdjacentHTML('beforeend', finalHtml);
         }
      },

      getRowForSubCategoriesTable(name, description) {
         let html = '<tr><td name = ' + name + '>' + this.capitalizeFirstLetter(name) + '</td><td>' + description + '</td></tr>';
         return html;
      },

      addSubCategoriesIntoUI(categoryName) {
         let html = "";
         let categoryObject = DataHandler.getCategoryData(categoryName.toLowerCase());
         let subcategoriesName = categoryObject.subcategoriesName;
         document.getElementsByName(HTMLStrings.subcategoryDropDownMenu)[0].innerHTML = "";
         for (let index in subcategoriesName) {
            let captailzedName = this.capitalizeFirstLetter(subcategoriesName[index]);
            html = '<a value=' + captailzedName + ' class="dropdown-item" href="#">' + captailzedName + '</a>'
            // Add the new element
            document.getElementsByName(HTMLStrings.subcategoryDropDownMenu)[0].insertAdjacentHTML('beforeend', html);
         }
      },

      addInputItem(itemObject, element, category, subcategory) {
         let html = "";
         html = '<tr><th scope="row">' + itemObject.id + '</th><td>' + itemObject.date + '</td><td>' + itemObject.description + '</td><td>' + itemObject.value +
            '</td><td>' + category + '</td><td>' + subcategory + '</td></tr>'
         // Add the new element
         document.getElementsByName(element)[0].insertAdjacentHTML('beforeend', html);
      },
      changeTextOfDropDown(valueToSet, nameOfElement) {
         let ele = document.getElementsByName(nameOfElement)[0];
         ele.innerHTML = valueToSet;
      },
      addNewSubCategoryToUI(name, description, category) {
         let html = "";
         html = this.getRowForSubCategoriesTable(name, description);
         let element = this.capitalizeFirstLetter(category) + "-tbody";
         // Add the new element
         document.getElementsByName(element)[0].insertAdjacentHTML('beforeend', html);
      },
      displayDefaultTextOnOverviewPage(elementName) {
         this.changeTextOfDropDown("No Data Available as of Now", elementName)
      },
      getPieChartDataObject(chartHeading, dataPointsArray) {
         let piecchartData = {
            theme: "light2",
            animationEnabled: true,
            title: {
               text: chartHeading,
               horizontalAlign: "left"
            },
            data: [{
               type: "pie",
               startAngle: 240,
               indexLabelFontSize: 14,
               indexLabel: "{label}- #percent%",
               toolTipContent: "<b>{label}:</b> {y} (#percent%)",
               dataPoints: dataPointsArray
            }]
         }
         return piecchartData;
      },
      getPieChartDataArray(keysArray, objectwithValue) {
         let dataArray = [];
         for (let index in keysArray) {
            let name = keysArray[index];
            let labelValue = objectwithValue[name].totalValue;
            let labelName = this.capitalizeFirstLetter(keysArray[index]);
            let dataValue = { y: labelValue, label: labelName }
            dataArray.push(dataValue);
         }
         return dataArray;
      },
      displayPieChartOnUI(elementId, displayAllData, rightsideElementName, individualOverviewName) {
         let piechartData;
         let dataPointsArray;
         let dataHolder = DataHandler.getDataHolder();
         let keys;
         let rightelement;
         if (displayAllData) {
            keys = Object.keys(dataHolder);
            dataPointsArray = this.getPieChartDataArray(keys, dataHolder);
            piechartData = this.getPieChartDataObject("Overview", dataPointsArray);
            rightelement = document.getElementsByName(rightsideElementName)[0];
            rightelement.innerHTML = "";
            rightelement.insertAdjacentHTML('beforeend', this.getRightSideOfPie(keys, DataHandler.getDataHolderTotal(), dataHolder))
         } else {
            let categoryObject = dataHolder[individualOverviewName];
            keys = Object.keys(categoryObject.subcategoriesData);
            dataPointsArray = this.getPieChartDataArray(keys, categoryObject.subcategoriesData);
            let heading = this.capitalizeFirstLetter(individualOverviewName) + " Overview";
            piechartData = this.getPieChartDataObject(heading, dataPointsArray);
            rightelement = document.getElementsByName(rightsideElementName)[0];
            rightelement.innerHTML = "";
            rightelement.insertAdjacentHTML('beforeend', this.getRightSideOfPie(keys, categoryObject.totalValue, categoryObject.subcategoriesData))
         }
         let chart = new CanvasJS.Chart(elementId, piechartData);
         chart.render();
      },

      getRightSideOfPie(keys, totalValue, ObjectWithIndivialData) {
         let heading = '<h5> Total : ' + totalValue + '</h5>';
         let list = '<ol>';
         let liTagElements = "";
         for (let keyindex in keys) {
            let keyname = keys[keyindex];
            liTagElements = liTagElements + '<li>' + this.capitalizeFirstLetter(keyname) + ' - ' + ObjectWithIndivialData[keyname].totalValue + '</li>'
         }
         let html = heading + list + liTagElements + '</ol>';
         return html;

      },

      getStringsForTabs(tabName) {
         let elementNodes = {}
         if (tabName === "savings") {
            elementNodes.defaultText = HTMLStrings.savingsOverviewPageMainContainer;
            elementNodes.pageHeading = HTMLStrings.savingsOverviewPageHeading;
            elementNodes.rightContainer = HTMLStrings.savingsOverviewPageRightSideContainer;
            elementNodes.piechartContainer = HTMLStrings.savingsOverviewPageChartContainer
         } else if (tabName === "investments") {
            elementNodes.defaultText = HTMLStrings.investmentsOverviewPageMainContainer;
            elementNodes.pageHeading = HTMLStrings.investmentsOverviewPageHeading;
            elementNodes.rightContainer = HTMLStrings.investmentsOverviewPageRightSideContainer;
            elementNodes.piechartContainer = HTMLStrings.investmentsOverviewPageChartContainer

         } else if (tabName === "expenses") {
            elementNodes.defaultText = HTMLStrings.expensesOverviewPageMainContainer;
            elementNodes.pageHeading = HTMLStrings.expensesOverviewPageHeading;
            elementNodes.rightContainer = HTMLStrings.expensesOverviewPageRightSideContainer;
            elementNodes.piechartContainer = HTMLStrings.expensesOverviewPageChartContainer

         } else if (tabName === "income") {
            elementNodes.defaultText = HTMLStrings.incomeOverviewPageMainContainer;
            elementNodes.pageHeading = HTMLStrings.incomeOverviewPageHeading;
            elementNodes.rightContainer = HTMLStrings.incomeOverviewPageRightSideContainer;
            elementNodes.piechartContainer = HTMLStrings.incomeOverviewPageChartContainer
         }
         return elementNodes;
      }
   }
})();
let HTMLStrings = UIHandler.getHTMLStrings();

let EventHandlers = (() => {
   function onAddCategoryTabClicked() {
      UIHandler.displaySubcategoriesOnUI();
   };

   return {
      onCategoryChange(event) {
         let selectedValue = event.target.getAttribute("value");
         UIHandler.changeTextOfDropDown(selectedValue, HTMLStrings.trackingDropDownText);
         UIHandler.addSubCategoriesIntoUI(selectedValue);
         let subcategoryele = document.getElementsByName(HTMLStrings.subcategorydiv)[0];
         subcategoryele.style.display = "block";
      },
      onCategorySelectedOnAddSub() {
         let selectedValue = event.target.getAttribute("value");
         UIHandler.changeTextOfDropDown(selectedValue, HTMLStrings.addsubcategoryCategoryDropDownButtonText);
      },

      onAddSubcategoryClicked() {
         let name = document.getElementsByName(HTMLStrings.addsubcategoryInputName)[0].value;
         let description = document.getElementsByName(HTMLStrings.addsubcategoryInputDescription)[0].value;
         let category = document.getElementsByName(HTMLStrings.addsubcategoryCategoryDropDownButtonText)[0].childNodes[0].nodeValue;
         UIHandler.addNewSubCategoryToUI(name, description, category);
         DataHandler.addSubCategoryToDataHolder(name.toLowerCase(), description, category.toLowerCase());        //clear the fields
         // Clear the input fields after adding element
         document.getElementsByName(HTMLStrings.addsubcategoryInputName)[0].value = "";
         document.getElementsByName(HTMLStrings.addsubcategoryInputDescription)[0].value = "";
         UIHandler.changeTextOfDropDown("select Category", HTMLStrings.addsubcategoryCategoryDropDownButtonText);

      },

      onSubCategoryChange(event) {
         let selectedValue = event.target.getAttribute("value");
         UIHandler.changeTextOfDropDown(selectedValue, HTMLStrings.subcategorytrackingDropDownText);
      },
      onAddMoneyForTracking() {
         let description = document.getElementsByName(HTMLStrings.addMoneyInputDescription)[0].value;
         let value = +document.getElementsByName(HTMLStrings.addMoneyInputValue)[0].value;
         let category = document.getElementsByName(HTMLStrings.trackingDropDownText)[0].childNodes[0].nodeValue;
         let subcategory = document.getElementsByName(HTMLStrings.subcategorytrackingDropDownText)[0].childNodes[0].nodeValue;

         if(category.toLowerCase() === "expenses") {
                 let combinedValue = value + DataHandler.getExpensesData().totalValue;
                 // DataHandler.getExpensesData().totalValue  DataHandler.getExpensesThreshold()
               if(DataHandler.getExpensesThreshold() && (combinedValue>DataHandler.getExpensesThreshold() )) {
                  alert("Expenses limit crossed");
                   // Clear the input fields after adding element
                document.getElementsByName(HTMLStrings.addMoneyInputDescription)[0].value = "";
                document.getElementsByName(HTMLStrings.addMoneyInputValue)[0].value = "";
                UIHandler.changeTextOfDropDown("select Category", HTMLStrings.trackingDropDownText);
                document.getElementsByName(HTMLStrings.subcategorydiv)[0].style.display = "none";
                UIHandler.changeTextOfDropDown("select subcategory", HTMLStrings.subcategorytrackingDropDownText);
                  return;
               }
         }
         //Follow the same order
         let itemsCount = DataHandler.getItemsCount() + 1;
         let input = DataHandler.createItem(subcategory.toLowerCase(), description, value, itemsCount);
         DataHandler.increaseItemsCount();
         DataHandler.insertItemTocategory(category, subcategory.toLowerCase(), input);
         UIHandler.addInputItem(input, HTMLStrings.addMoneyInputTable, category, subcategory);

         // Clear the input fields after adding element
         document.getElementsByName(HTMLStrings.addMoneyInputDescription)[0].value = "";
         document.getElementsByName(HTMLStrings.addMoneyInputValue)[0].value = "";
         UIHandler.changeTextOfDropDown("select Category", HTMLStrings.trackingDropDownText);
         document.getElementsByName(HTMLStrings.subcategorydiv)[0].style.display = "none";
         UIHandler.changeTextOfDropDown("select subcategory", HTMLStrings.subcategorytrackingDropDownText);
      },
      onLeftNavigationClicked(event) {
         let anchorValue = event.target.getAttribute("value");
         if (anchorValue === "overview-tab-value") {
            if (DataHandler.getItemsCount() === 0) {
               UIHandler.displayDefaultTextOnOverviewPage(HTMLStrings.overviewPageMainContainer)
            } else {
               UIHandler.displayPieChartOnUI(HTMLStrings.overviewPageChartContainer, true, HTMLStrings.overviewPageRightSideContainer);
               UIHandler.changeTextOfDropDown("", HTMLStrings.overviewPageHeading)
            }
         } else if (anchorValue === "add-subcategory-tab") {
            onAddCategoryTabClicked();
         } else if (anchorValue !== "add-money-tab-value") {
            let categoryName = anchorValue.toLowerCase();
            let elementNodes = UIHandler.getStringsForTabs(categoryName);
            let dataHolder = DataHandler.getDataHolder();
            let dataObject = dataHolder[categoryName];
            if (dataObject.totalItems === 0) {
               UIHandler.displayDefaultTextOnOverviewPage(elementNodes.defaultText)
            } else {
               UIHandler.displayPieChartOnUI(elementNodes.piechartContainer, false, elementNodes.rightContainer, categoryName);
               UIHandler.changeTextOfDropDown("", elementNodes.pageHeading);

            }
         }
      },

      onSetSavingsClicked() {
        let inputElement =  document.getElementsByName(HTMLStrings.expensesThresholdDisplay)[0];
        inputElement.style.display = "flex";
        document.getElementsByName(HTMLStrings.addMoneyMainInputRow)[0].style.display = "none";
        document.getElementsByName(HTMLStrings.trackingDropDownText)[0].style.display = "none";
        document.getElementsByName(HTMLStrings.addMoneyTableView)[0].style.display = "none";
        document.getElementsByName(HTMLStrings.trackMoneyHeading)[0].innerHTML = '<h4> Enter Expenses Threshold Value </h4>'

      },

      onSaveThresholdClicked() {
         let inputValue = +document.getElementsByName(HTMLStrings.expensesThresholdInputValue)[0].value;
         DataHandler.setExpensesThreshold(inputValue);
         
         // Clear the input fields after adding element
         document.getElementsByName(HTMLStrings.expensesThresholdInputValue)[0].value = "";
         document.getElementsByName(HTMLStrings.expensesThresholdDisplay)[0].style.display = "none";
         document.getElementsByName(HTMLStrings.addMoneyMainInputRow)[0].style.display = "";
         document.getElementsByName(HTMLStrings.trackingDropDownText)[0].style.display = "";
         document.getElementsByName(HTMLStrings.addMoneyTableView)[0].style.display = "";
         document.getElementsByName(HTMLStrings.trackMoneyHeading)[0].innerHTML = '<h4> Track Your Money </h4>'

      }
   }
})()

function setupEventHandlers() {
   document.getElementsByName(HTMLStrings.categoryDropDownMenu)[0].addEventListener("click", EventHandlers.onCategoryChange);
   document.getElementsByName(HTMLStrings.addMoneyInputButton)[0].addEventListener("click", EventHandlers.onAddMoneyForTracking);
   document.getElementsByName(HTMLStrings.subcategoryDropDownMenu)[0].addEventListener("click", EventHandlers.onSubCategoryChange);
   //document.getElementsByName(HTMLStrings.addsubcategorytab)[0].addEventListener("click", EventHandlers.onAddCategoryTabClicked);
   document.getElementsByName(HTMLStrings.addsubcategoryInputButton)[0].addEventListener("click", EventHandlers.onAddSubcategoryClicked);
   document.getElementsByName(HTMLStrings.addsubcategoryCategoryDropDown)[0].addEventListener("click", EventHandlers.onCategorySelectedOnAddSub);
   // document.getElementsByName(HTMLStrings.overviewTab)[0].addEventListener("click", EventHandlers.onOveriewTabClicked);
   document.getElementsByName(HTMLStrings.leftNavigationDiv)[0].addEventListener("click", EventHandlers.onLeftNavigationClicked);
   document.getElementsByName(HTMLStrings.expensesThresholdAnchorLink)[0].addEventListener("click", EventHandlers.onSetSavingsClicked);
   document.getElementsByName(HTMLStrings.expensesThresholdValueButton)[0].addEventListener("click", EventHandlers.onSaveThresholdClicked);
}

(() => {
   setupEventHandlers();
})()