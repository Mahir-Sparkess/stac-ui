import React, { Component } from 'react';
import { Item, Facet } from '../types';
import { StateType } from '../state/app.types';
import { Action, AnyAction} from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { push } from 'connected-react-router';
import { setItemList, setQuery, setAvailableFacets } from '../state/actions/actions';
import ItemList from '../Components/ItemList';
import { requestSearchItems, requestFacets } from '../requests';
import queryString from 'query-string';
import NavBar from "../Components/NavBar";
import FacetsBar from "../Components/FacetsBar";
import SearchBar from "../Components/SearchBar";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


interface SearchProps {
  url_query: string;
}

interface SearchStoreProps {
  query: string;
  selectedFacets: object;
  itemList: Item[];
}

interface SearchDispatchProps {
  setQuery: (query: string) => Action;
  setItemList: (itemList: Item[]) => Action;
  push: (path: string) => Action;
}

type SearchCombinedProps = SearchProps & SearchStoreProps & SearchDispatchProps;

class SearchPage extends Component< (SearchCombinedProps), {}>  {

  public async componentDidMount(): Promise<void> {
    let params = queryString.parse(this.props.url_query)
    // set query and facets from params
    await this.setFacets();
    await this.search(params.q, params.facets);
    }

  public setFacets = async (): Promise<void> => {
    
    const result = await requestFacets();
    if (result.success) {
    //   await this.props.setAvailableFacets(result.Facets);
    }
  };
  
  public search = async (query:any, facets:any): Promise<void> => {
    const result = await requestSearchItems(this.props.query, this.props.selectedFacets);
    if (result.success) {
      this.props.setItemList(result.itemList);
    }
  };

  public handleItemClick = async (item: Item): Promise<void> => {
    this.props.push(`/collections/${item.collection_id}/items/${item.id}`);
  };

  public handleSearch = async (e: any): Promise<void> => {
    this.props.push(`/search/q=${this.props.query}&facets=${JSON.stringify(this.props.selectedFacets)}`);
  };

  private handleQueryChange = async (e: any): Promise<void> => {
    this.props.setQuery(e.target.value);
  };

  public render(): React.ReactElement {
    return (
      <>
        <NavBar/>
        <Container>
          <Row>
            <Col xs={12} sm={4}>
              <br/>
              <FacetsBar url_query={this.props.url_query}/>
            </Col>
            <Col>
              <SearchBar handleSearch={this.handleSearch} handleQueryChange={this.handleQueryChange}/>
              <div style={{borderBottom: '1px solid grey', textAlign: 'right'}}>{this.props.itemList.length} Results</div>
              <>
                {this.props.itemList !== [] ? (
                  <ItemList 
                    items={this.props.itemList}
                    onClick={this.handleItemClick}
                  />
                ) : (
                  <p>No match found</p>
                )}
              </>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state: StateType): SearchStoreProps => {
    
  return {
    itemList: state.main.itemList,
    selectedFacets: state.main.selectedFacets,
    query: state.main.query,
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<StateType, null, AnyAction>
): SearchDispatchProps => ({
  setQuery: (query: string) =>
    dispatch(setQuery(query)),
  setItemList: (itemList: Item[]) =>
    dispatch(setItemList(itemList)),
  push: (path: string) =>
    dispatch(push(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);