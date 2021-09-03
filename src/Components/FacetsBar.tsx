import React, { Component } from 'react';
import { BboxFacet, Collection, DatetimeFacet, Facet } from '../types';
import { StateType } from '../state/app.types';
import { Action, AnyAction} from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { push } from 'connected-react-router';
import { setSearchFacets, setSearchFacetValue, setDatetimeFacet, setBboxFacet } from '../state/actions/actions';
import { requestFacets } from '../requests';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import Select from 'react-select';
import queryString from 'query-string';


interface FacetStoreProps {
  collection?: Collection;
  searchFacets: Facet[];
  bboxFacet: BboxFacet;
  datetimeFacet: DatetimeFacet;
}

interface FacetDispatchProps {
  setSearchFacets: (searchFacets: Facet[]) => Action;
  setSearchFacetValue: (id: string, value: any) => Action;
  setBboxFacet: (id: string, value: any) => Action;
  setDatetimeFacet: (id: string, value: any) => Action;
  push: (path: string) => Action;
}

type SearchCombinedProps = FacetStoreProps & FacetDispatchProps;

class FacetBar extends Component<SearchCombinedProps, {}> {

  public async componentDidMount(): Promise<void> {
    // set query and facets from params
    await this.setFacets();
  }

  public setFacets = async (): Promise<void> => {
    let params = queryString.parse(window.location.search);

    // if (params.filter) {
    //   for ()
    //   await this.setSearchFacetValue(params.filter);
    // }

    if (params.bbox && typeof params.bbox === 'string') {
      const bboxFacets = params.bbox.split(',');
      const bboxDefaults = ['-180', '-90', '180', '90'];
      var i = 0;
      for (const name of ['westBbox', 'southBbox','eastBbox', 'northBbox']) {
        if (bboxFacets[i] !== bboxDefaults[i]) {
          await this.setBboxFacet(name, Number(bboxFacets[i]));
        };        
        i++;
      };
    };

    if (params.datetime && typeof params.datetime === 'string') {
      const datetimeFacet = params.datetime.split(':');
      i = 0;
      for (const name of ['startTime', 'endTime']) {
        if (datetimeFacet[i] !== '..') {
          await this.setDatetimeFacet(name, datetimeFacet[i]);
        };
        i++;
      };
    };

    
    const result = await requestFacets(this.props.collection?.id);
    if (result.success) {
      this.props.setSearchFacets(result.availableFacets);
    }
  };

  private handleBboxFacetChange = async (e: any): Promise<void> => {
    await this.setBboxFacet(e.target.name, e.target.value);
  };
  
  private setBboxFacet = async (name: string, value: number): Promise<void> => {
    this.props.setBboxFacet(name, value);
  };

  private handleDatetimeFacetChange = async (e: any): Promise<void> => {
    await this.setDatetimeFacet(e.target.name, new Date(e.target.value).toISOString());
  };

  private setDatetimeFacet = async (name: string, value: string): Promise<void> => {
    this.props.setDatetimeFacet(name, value);
  };

  private handleSelectFacetChange = async (id: string, selectedOptions: { value:string, label:string }[]) => {
    if (selectedOptions !== []) {
      this.props.setSearchFacetValue(id, selectedOptions.map(option => { return option.value }));
    } else {
      this.props.setSearchFacetValue(id, []);
    };
  }

  private buildFacetBar(): React.ReactElement {
    let buffer = [
        <div key='1'>
          <h3>Facets</h3>
            <h5>Date</h5>
            <Container>
              <Row>
                <Col style={{textAlign:'right', paddingLeft:'5px', paddingRight:'5px'}}>
                  <FormLabel>Start Date: </FormLabel>
                </Col>
                <Col>
                  <FormControl type="date" name="startTime" max="3000-12-31"
                    min="1000-01-01" value={this.props.datetimeFacet.startTime} onChange={this.handleDatetimeFacetChange} />
                </Col>
              </Row>
              <Row>
                <Col style={{textAlign:'right', paddingLeft:'5px', paddingRight:'5px'}}>
                  <FormLabel>End Date: </FormLabel>
                </Col>
                <Col>
                  <FormControl type="date" name="endTime" max="3000-12-31"
                    min="1000-01-01" value={this.props.datetimeFacet.endTime} onChange={this.handleDatetimeFacetChange} />
                </Col>
              </Row>
            </Container>
            <br/>
            <h5>Bbox</h5>
            <Container style={{alignItems:'centre'}}>
              <Row>
                <Col/>
                <Col xs={5}>
                  <FormControl type='number' step='.001'
                    min='0' max='90' placeholder='North' name="northBbox" 
                    value={this.props.bboxFacet.northBbox} onChange={this.handleBboxFacetChange}/>
                </Col>
                <Col/>
              </Row>
              <Row>
                <Col xs={{span:5, offset:1}} style={{paddingRight:'0px', paddingLeft:'30px'}}>
                  <FormControl type='number' step='.001'
                    min='-180' max='0' placeholder='West' name="westBbox" 
                    value={this.props.bboxFacet.westBbox} onChange={this.handleBboxFacetChange}/>
                </Col>
                <Col xs={5} style={{paddingRight:'30px', paddingLeft:'0px'}}>
                  <FormControl type='number' step='.001'
                    min='0' max='180' placeholder='East' name="eastBbox"
                    value={this.props.bboxFacet.eastBbox} onChange={this.handleBboxFacetChange}/>
                </Col>
              </Row>
              <Row>
                <Col/>
                <Col xs={5}>
                  <FormControl type='number' step='.001'
                    min='-90' max='0' placeholder='South' name="southBbox"
                    value={this.props.bboxFacet.southBbox} onChange={this.handleBboxFacetChange}/>
                </Col>
                <Col/>
              </Row>
            </Container>
        </div>
    ];

      for (const f of this.props.searchFacets) {
        const options = [];
        if (f.options) {
          for (const option of f.options) {
            options.push(
              { value:option, label:option }
            );
          };
        }
        
        buffer.push(
          <div key={f.id}>
            <br/>
            <Container>
              <h5>{f.title}</h5>
              <Select aria-label={`${f.id} select`} isMulti isClearable name={f.id}
                options={options} onChange={(e: any) => {this.handleSelectFacetChange(f.id, e)}}/>
            </Container>
          </div>
        ) 
      }

    return <FormGroup>{buffer}</FormGroup>;
  }

  public render(): React.ReactElement {
    return <>{this.buildFacetBar()}</>;
  }
}

const mapStateToProps = (state: StateType): FacetStoreProps => {
    
  return {
    collection: state.main.selectedCollection,
    searchFacets: state.main.searchFacets,
    bboxFacet: state.main.bboxFacet,
    datetimeFacet: state.main.datetimeFacet,
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<StateType, null, AnyAction>
): FacetDispatchProps => ({
  setSearchFacets: (searchFacets: Facet[]) =>
    dispatch(setSearchFacets(searchFacets)),
  setSearchFacetValue: (id: string, value: any) =>
    dispatch(setSearchFacetValue(id, value)),
  setBboxFacet: (id: string, value: any) =>
    dispatch(setBboxFacet(id, value)),
  setDatetimeFacet: (id: string, value: any) =>
    dispatch(setDatetimeFacet(id, value)),
  push: (path: string) =>
    dispatch(push(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FacetBar);