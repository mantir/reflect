'use strict'
import React, {Component} from 'react';
import {
  TouchableHighlight,
  ListView,
  Platform,
  Text,
  View,
  NavigatorIOS,
  RefreshControl,
  ToolbarAndroid,
  Image
} from 'react-native';
//import BadgeView from 'Lernreflex/components/BadgeView';
import {styles, Badge, ListEntryCompetence} from 'Lernreflex/imports';
import Router from 'Lernreflex/Router';


class BadgeList extends Component{

  constructor(){
    super();
    this.unmounting = true;
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged : (s1, s2) => s1 !== s2
    });
    this.state = {
      refreshing: false,
      dataSource: ds,
      loaded: false
    };
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillUnmount(){
    this.unmounting = true;
  }

  componentDidMount(){
    this.unmounting = false;
    this.setState({dataSource:this.state.dataSource.cloneWithRows(['loader'])});
    this.loadData();
  }

  loadData(caching = false){
    var _this = this;
    var badge = new Badge(caching);
    this.setState({refreshing:true})
    var type = this.props.type;
    badge.getUserBadges().then((badges) => {
      if(badges && badges.length) {
        _this.setState({
          dataSource: _this.state.dataSource.cloneWithRows(badges),
          loaded: true,
          refreshing: false
        });
      } else {
        this.emptyList();
      }
    });
  }

  emptyList(){
    let text = 'Du hast noch keine Abzeichen. Du kannst diese Ansicht aktualisieren, indem du die Liste nach unten ziehst.';
    console.log('EMPTY');
    this.setState({
      dataSource:this.state.dataSource.cloneWithRows([{id:'empty', text:text}]),
      loaded: true, refreshing: false
    });
  }

  _onRefresh() {
    this.loadData(false);
  }


  rowPressed(rowData) {
    //console.warn(styles.route);
    /*if(rowData.type == 'badge'){
    Router.route({
    title: 'Badge',
    id: 'goal',
    component: BadgeView,
    passProps: {data: rowData}
    }, this.props.navigator);
    } */
  }



  renderSectionHeader(sectionData, sectionID){
    return null;
  }

  renderRow(rowData){
    if(rowData != 'loader')
      rowData.done = true;
    return <ListEntryCompetence
      type='badge'
      underlayColor={styles.list.liHover}
      onPress={() => this.rowPressed(rowData)}
      rowData={rowData}
      style={styles.list.li} />
    }

    render(){
      return <View style={styles.wrapper}>
        <ListView
          refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)} /> }
          style={styles._.list}
          dataSource={this.state.dataSource}
          renderSectionHeader={this.renderSectionHeader}
          renderRow={this.renderRow}>
        </ListView>
      </View>
    }
  }

  module.exports = BadgeList;
