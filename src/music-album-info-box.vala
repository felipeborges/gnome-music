/*
 * Copyright (C) 2012 Cesar Garcia Tapia <tapia@openshine.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

using Gtk;

private class Music.AlbumInfoBox {
    public Gtk.Widget actor { get { return box; } }

    private Gtk.Box box;

    private Gtk.Image art_image;
    private Gtk.Label artist_label;
    private Gtk.Label album_label;
    private Gtk.Label date_label;
    private Gtk.Label length_label;

    private Music.AlbumArtCache cache;
    private int ART_SIZE = 240;

    public AlbumInfoBox () {
        cache = AlbumArtCache.get_default ();

        box = new Gtk.Box (Orientation.VERTICAL, 10);
        box.set_homogeneous (false);

        art_image = new Gtk.Image ();
        box.pack_start (art_image, false, false);

        artist_label = new Gtk.Label ("Artist name");
        artist_label.get_style_context ().add_class ("music-albuminfo-artist");
        box.pack_start (artist_label, false, false);

        album_label = new Gtk.Label ("Album name");
        album_label.get_style_context ().add_class ("music-albuminfo-album");
        box.pack_start (album_label, false, false);

        var table = new Gtk.Table (2, 2, false);
        table.set_col_spacings (10);
        table.set_row_spacings (10);
        box.pack_start (table, false, false);

        var label = new Gtk.Label (_("Released"));
        label.get_style_context ().add_class ("dim-label");
        label.set_alignment (1, (float)0.5);
        table.attach_defaults (label, 0, 1, 0, 1);

        date_label = new Gtk.Label ("?");
        date_label.set_alignment (0, (float)0.5);
        table.attach_defaults (date_label, 1, 2, 0, 1);

        label = new Gtk.Label (_("Running Length"));
        label.get_style_context ().add_class ("dim-label");
        label.set_alignment (1, (float)0.5);
        table.attach_defaults (label, 0, 1, 1, 2);

        length_label = new Gtk.Label ("0 min");
        length_label.set_alignment (0, (float)0.5);
        table.attach_defaults (length_label, 1, 2, 1, 2);

        box.show_all ();
    }

    public void load (Grl.Media media) {
        artist_label.set_label (media.get_author());
        album_label.set_label (media.get_title());

        var pixbuf = cache.lookup (ART_SIZE, media.get_author (), media.get_title ());
        art_image.set_from_pixbuf (pixbuf);

        var date = media.get_publication_date();
        if (date != null) {
            date_label.set_label ((string)date.get_year());
        }

        var duration = media.get_duration ();
        string length ="";
        if (duration < 60) {
            length = _("%u secs").printf (duration);
        }
        else if (duration >= 60 && duration < 3600) {
            length = _("%u min").printf ((uint)GLib.Math.round (duration/60));
        }
        else {
            uint hours = (uint)(GLib.Math.floor (duration/3600));
            int divisor = duration % 3600;
            uint  minutes = (uint)(GLib.Math.round (divisor/60));
            if (hours <= 1) {
                length = _("1 hour %u min").printf (minutes);
            }
            else {
                length = _("%u hours %u min").printf (hours, minutes);
            }
        }
        length_label.set_label(length);
    }
}