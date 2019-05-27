import * as React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

function MainMenu(props) {
  const { classes } = props;

  const menuData = [[{ label: 'Maps', path: '/' }, { label: 'About', path: '/' }]];

  return (
    <div className={classes.root}>
      <div />
      {menuData.map((subMenuData, i) => (
        <div key={`submenu${i}`}>
          <Divider />
          <List
            classes={{
              root: props.classes.menuList
            }}
          >
            {subMenuData.map((item, index) => (
              <ListItem button key={item.label}>
                <Link to={item.path}>
                  <ListItemText
                    classes={{ primary: props.classes.listItemText }}
                    primary={item.label}
                  />
                </Link>
              </ListItem>
            ))}
          </List>
        </div>
      ))}
    </div>
  );
}

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 190,
    minWidth: 190,
    backgroundColor: theme.palette.background.paper
  },
  menuList: {
    background: '#000',
    border: 'none',
    padding: '0px',
    margin: '0px'
  },
  listItemText: {
    color: '#fff',
    background: '#000'
  }
});

export default withStyles(styles)(MainMenu);
