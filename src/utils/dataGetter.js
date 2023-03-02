// example: home/product/add -> return ['home','product','add']
function getPathNameUrl() {
  return window.location.pathname.substring(1).split('/');
}

// example: home?id=3&model=temp -> return [{id: '3'}, {model: 'temp'}]
function getQueryParamsFromUrl() {
  return window.location.search
    ? window.location.search
        .substring(1)
        .split('&')
        .map((x) => {
          let y = x.split('=');
          return {
            [y[0]]: y[1],
          };
        })
    : [];
}

// get current sub menu need to be opened
function getOpenKeyForMenu(list, current) {
  let openKey = '';
  list.forEach((item) => {
    if (item?.children?.length > 0) {
      item.children.forEach((x) => {
        if (x.label === current) {
          openKey = item.key;
        }
      });
    }
  });
  return openKey;
}

export const Getter = {
  getPathNameUrl,
  getQueryParamsFromUrl,
  getOpenKeyForMenu,
};
