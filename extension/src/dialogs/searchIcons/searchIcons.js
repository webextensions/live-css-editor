import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button/index.js';
import Dialog from '@material-ui/core/Dialog/index.js';
import DialogActions from '@material-ui/core/DialogActions/index.js';
import DialogContent from '@material-ui/core/DialogContent/index.js';
import DialogTitle from '@material-ui/core/DialogTitle/index.js';

import { SearchUi } from './searchUi.js';

import {
    APP_$_CLOSE_SEARCH_ICONS
} from 'reducers/actionTypes.js';

import './searchIcons.css';

function mapStateToProps(state) {
    return {
        open: state.app.searchIcons.open
    };
}

const SearchIcons = function (props) {
    const {
        open
    } = props;

    if (open) {
        const handleClose = () => {
            props.dispatch({ type: APP_$_CLOSE_SEARCH_ICONS });
        };

        return (
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    className="magicss-dialog-search-icons"
                >
                    <DialogTitle id="alert-dialog-title">{"Icons via Noun Project API"}</DialogTitle>
                    <DialogContent>
                        <SearchUi />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    } else {
        return null;
    }
};
SearchIcons.propTypes = {
    open: PropTypes.bool,
    dispatch: PropTypes.func
};

const _SearchIcons = connect(mapStateToProps)(SearchIcons);

export { _SearchIcons as SearchIcons };
