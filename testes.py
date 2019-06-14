
# -*- coding: utf-8 -*-
#!flask/bin/python

# See:
# http://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-vii-unit-testing
# https://pythonhosted.org/Flask-Testing/
# http://flask.pocoo.org/docs/0.10/testing/#testing
import json
import os
import unittest
import tempfile
import sys
sys.path.append('..')
import urllib  # cant use urllib2 in python3 :P
import config
import sample_strings
from flask import Flask
from flask.ext.testing import TestCase
from app import app
from utils import print_test_time_elapsed


class StartingTestCase(TestCase):
    def setUp(self):
        self.client = app.test_client()
        config.WTF_CSRF_ENABLED = False

        # load sample strings
        self.small_str = sample_strings.small_text
        self.medium_str = sample_strings.medium_text
        self.large_str = sample_strings.large_text

    def tearDown(self):
        pass

    def create_app(self):
        """
        This is a requirement for Flask-Testing
        """
        app = Flask(__name__)
        app.config['TESTING'] = True
        self.baseURL = "http://localhost:5000"
        return app

    # --------------------------------------------------------------------------
    # Simple tests to make sure server is UP
    # (does NOT use LiveServer)
    # --------------------------------------------------------------------------
    @print_test_time_elapsed
    def test_api_is_up_and_running(self):
        response = urllib.request.urlopen(self.baseURL)
        self.assertEqual(response.code, 200)
        # returned source code is stored in
        # response.read()

    # --------------------------------------------------------------------------
    # Testing APi endpoints
    # --------------------------------------------------------------------------
    @print_test_time_elapsed
    def test_api_post_summarize(self):
        post_data = {'article': self.small_str, 'algorithm': 'summarize'}
        rv = self.client.post(
            '/api/summarize', data=post_data)
        # print(rv.data)
        js = json.loads(rv.data.decode("utf-8"))
        assert rv.status_code == 200
        assert 'Todos os direitos reservados' in js['article_summary']
        assert 'summarize' in js['algorithm']

    @print_test_time_elapsed
    def test_api_post_textrank(self):
        post_data = {'article': self.small_str, 'algorithm': 'textrank'}
        rv = self.client.post(
            '/api/summarize', data=post_data)
        js = json.loads(rv.data.decode("utf-8"))
        assert rv.status_code == 200
        assert 'Todos os direitos reservados' in js['article_summary']
        assert 'textrank' in js['algorithm']


if __name__ == '__main__':
    unittest.main()
