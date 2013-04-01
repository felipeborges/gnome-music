/*
 * Copyright (c) 2013 Eslam Mostafa.
 *
 * Gnome Music is free software; you can Public License as published by the
 * Free Software Foundation; either version 2 of the License, or (at your
 * option) any later version.
 *
 * Gnome Music is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with Gnome Music; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * Author: Eslam Mostafa <cseslam@gmail.com>
 *
 */


const Lang = imports.lang;
const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gd = imports.gi.Gd;

const Toolbar = imports.toolbar;
const Views = imports.view;
const Player = imports.player;

const Gettext = imports.gettext;
const _ = imports.gettext.gettext;

var AppState = {
    ARTISTS: 0,
    ALBUMS: 1,
    SONGS: 2,
    PLAYLISTS: 3,
    PLAYLIST: 4,
    PLAYLIST_NEW: 5
};

const Application = new Lang.Class({
    Name: 'Music',
    Extends: Gtk.Application,

    _init: function() {
        this.parent({
            application_id: 'org.gnome.Music',
            flags: Gio.ApplicationFlags.FLAGS_NONE,
            inactivity_timeout: 12000
        });
        
        GLib.set_application_name(_("Music"));
    },

    _buildApp: function() {
        this._window = new Gtk.ApplicationWindow({
            application: this,
            title: _("Music"),
            window_position: Gtk.WindowPosition.CENTER,
            hide_titlebar_when_maximized: true
        });


        this._window.set_size_request (800, 600)
        this.vbox = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 0
        });

        this.player = new Player.Player();

        this.views = [];

        this.toolbar = new Toolbar.Toolbar();
        this._stack = new Gd.Stack({
            visible: true
        });

        this._window.set_default_size(640, 400);
        this.vbox.pack_start(this.toolbar, false, false, 0);
        this.vbox.pack_start(this._stack, true, true, 0);
        this.vbox.pack_start(this.player.eventbox, false, false, 0);
        this._window.add(this.vbox);

        this.views[0] = new Views.Albums(this.toolbar);
        this.views[1] = new Views.Artists(this.toolbar);
        this.views[2] = new Views.Songs(this.toolbar);
        this.views[3] = new Views.Playlists(this.toolbar);

        for (let i in this.views) {
            this._stack.add_titled(
                this.views[i],
                this.views[i].title,
                this.views[i].title
            );
        }

        //this._stack.connect("notify::visible-child", this._onNotifyMode);

        this.views[0].populate();
        this.toolbar.set_stack(this._stack);
        this.toolbar.show();
        this.player.eventbox.show_all();
        this.vbox.show();
    },

    _onNotifyMode: function(stack, param) {
        stack.get_visible_child().populate();
    },

    _buildAppMenu: function() {
        var builder,
            menu;

        builder = new Gtk.Builder();
        builder.add_from_file('resources/app-menu.ui'); //fix this

        menu = builder.get_object('app-menu');
        this.set_app_menu(menu);
    },

    _toggleView: function(btn, i) {
        this._stack.set_visible_child(this.views[i])
    },

    vfunc_activate: function() {
        this._window.present();
    },

    vfunc_startup: function() {
        this.parent();
        Gtk.init(null);
        this._buildApp();
    }
});
