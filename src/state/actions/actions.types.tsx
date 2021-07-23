import { Facet, Item, Collection } from "../../types";

export const setItemListType = 'set_item_list';
export const setCollectionListType = 'set_collection_list';
export const selectItemType = 'select_item';
export const deselectItemType = 'deselect_item';
export const selectCollectionType = 'select_collection';
export const deselectCollectionType = 'deselect_collection';
export const setAvailableFacetsType = 'set_available_facets';
export const setSelectedFacetType = 'set_selected_facet';
export const setLoadingType = 'set_loading';
export const setQueryType = 'set_query';


export interface setItemListPayload {
  itemList: Item[];
}

export interface setCollectionListPayload {
  collectionList: Collection[];
}

export interface selectItemPayload {
  item: Item;
}

export interface selectCollectionPayload {
  collection: Collection;
}

export interface setLoadingPayload {
  loading: boolean;
}

export interface setQueryPayload {
  query: string;
}

export interface setAvailableFacetsPayload {
  availableFacets: Facet[];
}

export interface setSelectedFacetPayload {
  selectedFacet: string;
  facetValue: any;
}
