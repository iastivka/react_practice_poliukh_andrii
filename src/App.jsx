/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const products = productsFromServer.map(product => {
    const category = categoriesFromServer.find(
      cat => cat.id === product.categoryId,
    );
    const user = usersFromServer.find(usr => usr.id === category?.ownerId);

    return {
      id: product.id,
      name: product.name,
      category,
      user,
    };
  });

  const filteredProducts = products.filter(p => {
    const matchesUser = selectedUserId ? p.user?.id === selectedUserId : true;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategoryIds.length > 0
        ? selectedCategoryIds.includes(p.category?.id)
        : true;

    return matchesUser && matchesSearch && matchesCategory;
  });

  function toggleCategory(id) {
    setSelectedCategoryIds(function (prev) {
      if (prev.includes(id)) {
        return prev.filter(function (cid) {
          return cid !== id;
        });
      }

      return [...prev, id];
    });
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                href="#/"
                className={!selectedUserId ? 'is-active' : ''}
                onClick={e => {
                  e.preventDefault();
                  setSelectedUserId(null);
                }}
                data-cy="FilterAllUsers"
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  href="#/"
                  key={user.id}
                  className={selectedUserId === user.id ? 'is-active' : ''}
                  onClick={e => {
                    e.preventDefault();
                    setSelectedUserId(user.id);
                  }}
                  data-cy="FilterUser"
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchTerm && (
                  <span className="icon is-right" style={{ cursor: 'pointer' }}>
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchTerm('')}
                      aria-label="Clear search"
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button mr-6 ${selectedCategoryIds.length === 0 ? 'is-success' : 'is-outlined'}`}
                onClick={e => {
                  e.preventDefault();
                  setSelectedCategoryIds([]);
                }}
              >
                All
              </a>

              {categoriesFromServer.map(cat => (
                <a
                  data-cy="Category"
                  className={`button mr-2 my-1 ${selectedCategoryIds.includes(cat.id) ? 'is-info' : ''}`}
                  href="#/"
                  key={cat.id}
                  onClick={e => {
                    e.preventDefault();
                    toggleCategory(cat.id);
                  }}
                >
                  {cat.icon} {cat.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={e => {
                  e.preventDefault();
                  setSelectedUserId(null);
                  setSearchTerm('');
                  setSelectedCategoryIds([]);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>User</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(({ id, name, category, user }) => (
                  <tr key={id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {id}
                    </td>
                    <td data-cy="ProductName">{name}</td>
                    <td data-cy="ProductCategory">
                      {category ? (
                        <>
                          <span aria-label="category-icon" role="img">
                            {category.icon}
                          </span>{' '}
                          - {category.title}
                        </>
                      ) : (
                        'No category'
                      )}
                    </td>
                    <td
                      data-cy="ProductUser"
                      className={
                        user?.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                      }
                    >
                      {user ? user.name : 'No user'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
