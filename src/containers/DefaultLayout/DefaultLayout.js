import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { Provider } from "react-redux";
import store from "../../store/index";
import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '../../core/index.js';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import ItemView from "../../views/ItemView";

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  constructor(props){
    super(props);
    this.state = {items:[], numberOfItems:0};
    this.addToCart = this.addToCart.bind(this);
  }

  addToCart(newItem){
    this.state.items.push(newItem);
    this.setState({numberOfItems:this.state.numberOfItems+1});
  }

  signOut(e) {
    e.preventDefault();
    this.props.history.push('/login')
  }

  async componentDidMount() {
    await fetch("http://127.0.0.1:8080/pos/categories/get").then(
      results => {
        return results.json()
      }
    ).then(data=>{
      for (let i=0; i<navigation.items.length;i++){
        if (navigation.items[i].name=="Purchase" ||  navigation.items[i].name=="Women"){
          for (let j=0; j<data.data.length;j++) {
            routes.push({key: data.data[j].id, path: '/item'+ '/:id', exact: true, name: 'ItemView', component: ItemView})

            navigation.items[i].children.push(
              {
                id: data.data[j].id,
                name: data.data[j].name,
                url: '/item/'+data.data[j].id,
                icon: 'icon-puzzle'
              }
            )
          }
        }
      }
      this.forceUpdate();
    });
  }

   render() {



    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense  fallback={this.loading()}>
            <Provider store={store}>
              <DefaultHeader onLogout={e=>this.signOut(e)} items={this.state.items} numberOfItems={this.state.numberOfItems}/>
            </Provider>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
            <AppSidebarNav navConfig={navigation} {...this.props }/>
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes}/>
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <Provider store={store}>
                            <route.component {...props}  addToCart={this.addToCart}/>
                          </Provider>
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <Provider store={store}>
                <DefaultAside />
              </Provider>
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
